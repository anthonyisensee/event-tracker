import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { getAllEventsWithTrackerId, getTracker, deleteTracker, deleteEvent, addTracker, putTracker, getLastEventWithTrackerId, getNextEventWithTrackerId } from "../../IndexedDB/IndexedDB"
import { getEventDate, timeBetween, timeSinceDateArray } from "../../DateHelperFunctions"
import Modal from "../../Shared/Bulma/Modal"

const Tracker = () => {
    
    // TODO: For all pages: if an ID is not included redirect to the trackers page.
    const [params] = useSearchParams()
    const trackerId = Number(params.get("id"))

    const navigate = useNavigate()

    const location = useLocation()
    const { referrer } = location.state || {}

    const [tracker, setTracker] = useState()
    const [editedTracker, setEditedTracker] = useState()
    const [displayEvent, setDisplayEvent] = useState()
    const [events, setEvents] = useState()
    const [timeDisplayTimeBetween, setTimeDisplayTimeBetween] = useState()
    
    const [mode, setMode] = useState(!trackerId ? "create" : "view")
    const defaultReferrer = "/trackers"

    const [trackerDeleteModalIsActive, setTrackerDeleteModalIsActive] = useState(false)
    const [eventDeleteModalIsActive, setEventDeleteModalIsActive] = useState(false)
    const [eventToDelete, setEventToDelete] = useState({})

    const getAndSetTracker = useCallback(async (trackerId) => {

        getTracker(trackerId)
            .then(tracker => { 
                setTracker(tracker)
                setEditedTracker(tracker)
            })
            .catch(error => console.error(error))

    }, [])

    const getAndSetDisplayEvent = useCallback(async (tracker) => {

        if (tracker.targets === "Only future events" || tracker.targets === "Future events, then past events") {

            getNextEventWithTrackerId(tracker.id)
                .then(event => {

                    // Needs to happen whether or not a next event exists
                    setDisplayEvent(event)

                    // If the next event doesn't exist and the right targeting mode has been set search for a last event
                    if (!event && tracker.targets === "Future events, then past events") {

                        getLastEventWithTrackerId(tracker.id)
                            .then(event => setDisplayEvent(event))
                            .catch(error => console.error(error))

                    }

                })
                .catch(error => console.error(error))
        
        } else if (tracker.targets === "Only past events" || tracker.targets === "Past events, then future events") { 
                
            getLastEventWithTrackerId(tracker.id)
                .then(event => {

                    setDisplayEvent(event)

                    // If the last event doesn't exist and the right targeting mode has been set search for a next event
                    if (!event && tracker.targets === "Past events, then future events") {

                        getNextEventWithTrackerId(tracker.id)
                            .then(event => setDisplayEvent(event))
                            .catch(error => console.error(error))

                    }

                })
                .catch(error => console.error(error))

        }

    }, [])

    const getAndSetEvents = useCallback(async (trackerId) => {

        getAllEventsWithTrackerId(trackerId)
            .then(events => setEvents(events))
            .catch(error => console.error(error))

    }, [])

    useEffect(() => {

        getAndSetTracker(trackerId)
        getAndSetEvents(trackerId)

    }, [trackerId, getAndSetTracker, getAndSetEvents])

    // Once the tracker object has been loaded get the most relevant event and set it to the time display.
    useEffect(() => {

        tracker && getAndSetDisplayEvent(tracker)
        
    }, [tracker, getAndSetDisplayEvent])

    useEffect(() => {

        // Don't do anything until the displayEvent has been set
        if (displayEvent) {

            // Update timeSinceArray for the first time
            setTimeDisplayTimeBetween(timeBetween(displayEvent))

            // Set an interval to update the timeSinceArray subsequent times
            const interval = setInterval(() => {
                setTimeDisplayTimeBetween(timeBetween(displayEvent))
            }, 1000)

            // Clean up the interval when the component unmounts
            return () => clearInterval(interval)

        }

    }, [displayEvent])

    const handleTrackerDelete = () => {

        deleteTracker(trackerId)
            .then(() => navigate(defaultReferrer))
            .catch(error => console.error(error))

    }

    const handleEventDeleteConfirm = (eventToDelete) => {

        setEventToDelete(eventToDelete)
        setEventDeleteModalIsActive(true)

    }

    const handleEventDelete = () => {

        deleteEvent(eventToDelete.id)
            .then(() => setEventDeleteModalIsActive(false))
            .then(() => getAllEventsWithTrackerId(trackerId))
            .then((events) => setEvents(events))
            .then(() => getAndSetDisplayEvent(tracker))   // Get and set the display event in case it was just deleted
            .catch(error => console.error(error))

    }

    const handleSubmit = (submitEvent) => {

        submitEvent.preventDefault()

        if (mode === "create") {

            addTracker(editedTracker ?? {})
                .then(() => {

                    // If a referrer exists, navigate to it
                    navigate(referrer ?? defaultReferrer)

                })
                .catch(error => console.error(error))

        } else if (mode === "edit") {

            putTracker(editedTracker)
                .then(() => {
                    setMode("view")
                    setTracker(editedTracker)
                })
                .catch(error => console.error(error))

        }

    }

    return (
        <div>
            {/* Tracker delete modal */}
            {tracker && 
                <Modal
                    isActive={trackerDeleteModalIsActive}
                    setIsActive={setTrackerDeleteModalIsActive}
                    onAction={() => handleTrackerDelete()}
                    action="delete"
                    headerTitle="Delete tracker?"
                    bodyContent={
                        <div className="content">
                            <p>This will delete the {tracker.name ? `"${tracker.name}"` : ""} tracker and any of its tracked events.</p>
                            <p className="has-text-weight-bold">Please be certain that this is what you want to do as it cannot be undone!</p>
                        </div>
                    } 
                />
            }
            {/* Event delete modal */}
            {eventToDelete &&
                <Modal
                    isActive={eventDeleteModalIsActive}
                    setIsActive={setEventDeleteModalIsActive}
                    onAction={handleEventDelete}
                    action="delete"
                    headerTitle="Delete event?"
                    bodyContent={
                        <div className="content">
                            <p>This will delete the event that occurred on {eventToDelete.date} at {eventToDelete.time}{eventToDelete.description ? " with the following description:" : "."}</p>
                            <p>{eventToDelete.description}</p>
                            <p className="has-text-weight-bold">Please be certain that this is what you want to do as it cannot be undone!</p>
                        </div>
                    } 
                />
            }
            {tracker && <>
                <div className="content has-text-centered">
                    <h1>{tracker.name ?? <span className="is-italic">Unnamed Tracker</span>}</h1>
                </div>
                {timeDisplayTimeBetween && <>
                    <div className="has-text-centered is-flex is-justify-content-center">
                        {timeDisplayTimeBetween && timeDisplayTimeBetween.timeUnits.map((time, index) => (
                            <div className="mb-5 ml-5 mr-5" key={index}>
                                <p className="number is-size-1 has-text-weight-bold">{time.number}</p>
                                <p className="unit is-size-5">{time.unit}</p>
                            </div>
                        ))}
                    </div>
                    <div className="content has-text-centered is-size-4">
                        <p>
                            {!timeDisplayTimeBetween.inFuture && <>
                                {timeDisplayTimeBetween.timeUnits[timeDisplayTimeBetween.timeUnits.length - 1].isPlural 
                                        ? "have" : "has"
                                } passed since {displayEvent ? "the" : "there is no"} {displayEvent ? <Link to={`/event?id=${displayEvent.id}`}>last event</Link> : "last event."}.
                            </>}
                            {timeDisplayTimeBetween.inFuture && <>
                                until the { displayEvent ? <Link to={`/event?id=${displayEvent.id}`}>next event</Link> : "next event"}.
                            </>}
                        </p>
                    </div>
                </>}
            </>}
            <div className="content mt-6">
                <h2>{mode !== "view" ? mode.charAt(0).toUpperCase() + mode.slice(1) + " " : ""}Tracker</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        {mode === "view" && <p>{tracker?.name ?? <span className="is-italic">Unnamed Tracker</span>}</p>}
                        {mode !== "view" && 
                            <input 
                                type="text" 
                                className="input" 
                                defaultValue={tracker?.name}
                                onChange={(e) => setEditedTracker({...editedTracker, name: e.target.value})}
                            />
                        }
                    </div>
                </div>
                <div className="field">
                    <label className="label">Targets</label>
                    <div className="control">
                        {mode === "view" && <p>{tracker?.targets}</p>}
                        {mode !== "view" &&
                            <div className="select">
                                <select 
                                    name="Targets"
                                    onChange={(e) => setEditedTracker({...editedTracker, targets: e.target.value})}
                                    defaultValue={tracker?.targets ?? "Future events, then past events"}
                                >
                                    <option value="Future events, then past events">Future events, then past events</option>
                                    <option value="Only past events">Only past events</option>
                                    <option value="Past events, then future events">Past events, then future events</option>
                                    <option value="Only future events">Only future events</option>
                                </select>
                            </div>
                        }
                    </div>
                    {mode !== "view" &&
                        <div className="help"><p>The events the tracker's timers or countdowns will target.</p></div>
                    }
                </div>
                <div className="field is-grouped">
                    {mode === "view" && <>
                        <div className="control">
                            <button onClick={() => setMode("edit")} type="button" className="button">Edit</button>
                        </div>
                        <div className="control">
                            <button onClick={() => setTrackerDeleteModalIsActive(true)} type="button" className="button is-danger">Delete</button>
                        </div>
                    </>}
                    {mode === "edit" && <>
                        <div className="control">
                            <button onClick={() => setMode("view")} className="button" type="button">Cancel</button>
                        </div>
                        <div className="control">
                            <button className="button is-success">Save</button>
                        </div>
                    </>}
                    {mode === "create" && <>
                        <div className="control">
                            <button
                                onClick={() => navigate(referrer ? referrer : defaultReferrer)}
                                className="button"
                                type="button"
                            >Cancel</button>
                        </div>
                        <div className="control">
                            <button className="button is-success">Create</button>
                        </div>
                    </>}
                </div>
            </form>
            {tracker && <>
                <div className="content mt-6">
                    <h2>Events</h2>
                </div>
                <div className="buttons">
                    <Link to={`/event?trackerid=${trackerId}`} className="button is-warning">Log New Event</Link>
                </div>
                <div className="table-container">
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Description</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {events && events.map((eventObject, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{eventObject.date}</td>
                                        <td>{eventObject.time}</td>
                                        <td>{eventObject.description}</td>
                                        <td>
                                            <div className="buttons is-right">
                                                <Link to={`/event?id=${eventObject.id}`} className="button">View</Link>
                                                <button onClick={() => handleEventDeleteConfirm(eventObject)} className="button is-danger">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </>}
        </div>
    )

}

export default Tracker
