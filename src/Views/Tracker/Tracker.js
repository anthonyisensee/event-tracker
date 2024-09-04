import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getAllEventsWithTrackerId, getTracker, deleteTracker, deleteEvent } from "../../IndexedDB/IndexedDB"

const Tracker = () => {
    
    const params = useParams()
    const trackerId = Number(params.trackerId)

    const navigate = useNavigate()

    const [tracker, setTracker] = useState()
    const [events, setEvents] = useState()

    // TODO: For all pages: if an ID is not included redirect to the trackers page.

    // Get the tracker and its events by the trackerId parameter passed to the page
    useEffect(() => {

        getTracker(trackerId)
            .then((tracker) => {
                setTracker(tracker)
            })
            .catch((error) => {
                console.error(error)
            })

        getAllEventsWithTrackerId(trackerId)
            .then((events) => {
                setEvents(events)
            })
            .catch((error) => {
                console.error(error)
            })

    }, [trackerId])

    setTimeout(() => {
        // setTimeSinceArray(tracker.timeSinceLastEventArray)
    }, 1000)

    const handleDelete = () => {

        deleteTracker(trackerId)
            .then(() => navigate('/'))
        

    }

    const handleEventDelete = (eventId) => {

        deleteEvent(eventId)
            .then(() => getAllEventsWithTrackerId(trackerId))
            .then((events) => setEvents(events))

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>{tracker && tracker.name}</h1>
            </div>
            <div className="time-since has-text-centered is-flex is-justify-content-center">
                {/* {timeSinceArray.map((time, index) => (
                    <div className="mb-5 ml-5 mr-5" key={index}>
                        <p className="number is-size-1 has-text-weight-bold">{time.number}</p>
                        <p className="unit is-size-5">{time.unit}{time.number === 1 ? "" : "s"}</p>
                    </div>
                ))} */}
            </div>
            <div className="content has-text-centered is-size-4">
                <p>has passed since the last event.</p>
            </div>
            <div className="buttons is-centered mt-6">
                <Link to={tracker && `/tracker/edit/${tracker.id}`} className="button">Edit Tracker</Link>
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
        </div>
    )

}

export default Tracker
