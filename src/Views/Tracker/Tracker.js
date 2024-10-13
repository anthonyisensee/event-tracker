import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { getAllEventsWithTrackerId, getTracker, deleteTracker, deleteEvent, addTracker, putTracker } from "../../IndexedDB/IndexedDB"
import Modal from "../../Shared/Bulma/Modal"
import TimeDisplay from "../../Shared/TimeDisplay"
import TrackerModel from "../../Models/TrackerModel"

const Tracker = () => {
    
    // TODO: For all pages: if an ID is not included redirect to the trackers page.
    const [params] = useSearchParams()
    const trackerId = Number(params.get("id"))

    const navigate = useNavigate()

    const location = useLocation()
    const { referrer } = location.state || {}

    const [tracker, setTracker] = useState()
    const [editedTracker, setEditedTracker] = useState()
    const [events, setEvents] = useState()
    
    const [mode, setMode] = useState(!trackerId ? "create" : "view")
    const defaultReferrer = "/trackers"

    const [trackerDeleteModalIsActive, setTrackerDeleteModalIsActive] = useState(false)
    const [eventDeleteModalIsActive, setEventDeleteModalIsActive] = useState(false)
    const [eventToDelete, setEventToDelete] = useState({})

    const trackerModel = new TrackerModel()

    const getAndSetTracker = useCallback(async (trackerId) => {

        getTracker(trackerId)
            .then(tracker => { 
                setTracker(tracker)
                setEditedTracker(tracker)
            })
            .catch(error => console.error(error))

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
            .then(() => {
                // Toggle the value of a property on the tracker to force the time display to re-render
                setTracker({ 
                    ...tracker, 
                    propertyToForceRerender: !tracker.propertyToForceRerender 
                })
            })
            .catch(error => console.error(error))

    }

    const handleSubmit = (submitEvent) => {

        submitEvent.preventDefault()

        if (mode === "create") {

            // Set defaults for required properties if no values have been provided
            const trackerToAdd = {
                targets: trackerModel.properties.targets.defaultOptionIndex,
                ...editedTracker,
            }
            
            addTracker(trackerToAdd)
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
                <TimeDisplay
                    tracker={tracker}
                    timesContainerClassName={"mb-5 ml-5 mr-5"}
                    timesClassName={"is-size-1 has-text-weight-bold"}
                    unitsClassName={"is-size-5"}
                    descriptionClassName={"is-size-4"}
                />
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
                                onChange={(e) => setEditedTracker({
                                    ...editedTracker, 
                                    name: e.target.value
                                })}
                            />
                        }
                    </div>
                </div>
                <div className="field">
                    <label className="label">Targets</label>
                    <div className="control">
                        {mode === "view" && <p>{trackerModel.properties.targets.options[tracker?.targets]?.label}</p>}
                        {mode !== "view" &&
                            <div className="select">
                                <select 
                                    name="Targets"
                                    onChange={(e) => setEditedTracker({
                                        ...editedTracker, 
                                        targets: e.target.value
                                    })}
                                    defaultValue={
                                        tracker?.targets ?? 
                                        trackerModel.properties.targets.options[trackerModel.properties.targets.defaultOptionIndex]
                                    }
                                >
                                    {trackerModel.properties.targets.options.map((option, index) => { return (
                                        <option key={index} value={option.value}>{option.label}</option>
                                    )})}
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
