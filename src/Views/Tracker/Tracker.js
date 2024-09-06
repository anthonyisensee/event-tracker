import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getAllEventsWithTrackerId, getTracker, deleteTracker, deleteEvent } from "../../IndexedDB/IndexedDB"
import { getLatestEventWithTrackerId } from "../../IndexedDB/IndexedDB"
import { getEventDate, timeSinceDateArray } from "../../DateHelperFunctions"

const Tracker = () => {
    
    // TODO: For all pages: if an ID is not included redirect to the trackers page.
    const params = useParams()
    const trackerId = Number(params.trackerId)

    const navigate = useNavigate()

    const [tracker, setTracker] = useState()
    const [latestEvent, setLatestEvent] = useState()
    const [events, setEvents] = useState()
    const [timeSinceArray, setTimeSinceArray] = useState()


    const getAndSetTracker = useCallback(async (trackerId) => {

        getTracker(trackerId)
            .then(tracker => setTracker(tracker))
            .catch(error => console.error(error))

    }, [])

    const getAndSetLatestEvent = useCallback(async (trackerId) => {

        getLatestEventWithTrackerId(trackerId)
            .then(event => setLatestEvent(event))
            .catch(error => console.error(error))

    }, [])

    const getAndSetEvents = useCallback(async (trackerId) => {

        getAllEventsWithTrackerId(trackerId)
            .then(events => setEvents(events))
            .catch(error => console.error(error))

    }, [])

    useEffect(() => {

        getAndSetTracker(trackerId)
        getAndSetLatestEvent(trackerId)
        getAndSetEvents(trackerId)

    }, [trackerId])

    useEffect(() => {

        // Don't do anything until the latestEvent has been set
        if (latestEvent) {

            // Update timeSinceArray for the first time
            setTimeSinceArray(timeSinceDateArray(getEventDate(latestEvent)))

            // Set an interval to update the timeSinceArray subsequent times
            const interval = setInterval(() => {
                setTimeSinceArray(timeSinceDateArray(getEventDate(latestEvent)))
            }, 1000)

            // Clean up the interval when the component unmounts
            return () => clearInterval(interval)

        }

    }, [latestEvent])

    const handleDelete = () => {

        deleteTracker(trackerId)
            .then(() => navigate('/'))
            .catch(error => console.error(error))

    }

    const handleEventDelete = (eventId) => {

        deleteEvent(eventId)
            .then(() => getAllEventsWithTrackerId(trackerId))
            .then((events) => setEvents(events))
            .then(getAndSetLatestEvent())   // Get and set the latest event in case it was just deleted
            .catch(error => console.error(error))

    }

    return (
        <div>
            {tracker && <>
                <div className="content has-text-centered">
                    <h1>{tracker.name}</h1>
                </div>
                {timeSinceArray && <>
                    <div className="time-since has-text-centered is-flex is-justify-content-center">
                        {timeSinceArray && timeSinceArray.map((time, index) => (
                            <div className="mb-5 ml-5 mr-5" key={index}>
                                <p className="number is-size-1 has-text-weight-bold">{time.number}</p>
                                <p className="unit is-size-5">{time.unit}</p>
                            </div>
                        ))}
                    </div>
                    <div className="content has-text-centered is-size-4">
                        <p>
                            {timeSinceArray[timeSinceArray.length - 1].isPlural ? "have" : "has"} passed since {tracker.mostRecentEvent ? "the" : "there is no"} last event.
                        </p>            
                    </div>
                </>}
                <div className="buttons is-centered mt-6">
                    <Link to={`/tracker/edit/${tracker.id}`} className="button">Edit Tracker</Link>
                    <button className="button is-danger" onClick={handleDelete}>Delete Tracker</button>
                </div>
                <br />
                <br />
                <div className="content mt-6">
                    <h2 className="has-text-centered">Events</h2>
                </div>
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
                        {events && events.map((event, index) => {
                            return (
                                <tr key={index}>
                                    <td>{event.date}</td>
                                    <td>{event.time}</td>
                                    <td>{event.description}</td>
                                    <td>
                                        <div className="buttons is-right">
                                            <Link to={`/event/edit/${event.id}`} className="button">Edit</Link>
                                            <button onClick={() => handleEventDelete(event.id)} className="button is-danger">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="buttons is-centered mt-6">
                    <Link to={`/event/create/${trackerId}`} className="button is-warning">Log New Event</Link>
                </div>
            </>}
        </div>
    )

}

export default Tracker
