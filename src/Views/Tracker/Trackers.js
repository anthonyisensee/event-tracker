import { useState, useEffect } from "react"
import { getAllTrackers, getLatestEventWithTrackerId } from "../../IndexedDB/IndexedDB"
import { Link, useLocation } from "react-router-dom"

const Trackers = () => {

    const [trackers, setTrackers] = useState()

    const location = useLocation()

    useEffect(() => {

        getAllTrackers()
            .then(trackers => {

                const latestEvents = trackers.map(tracker => getLatestEventWithTrackerId(tracker.id))

                Promise.all(latestEvents)
                    .then(events => {
                        
                        const enrichedTrackers = []

                        trackers.forEach((tracker, index) => {
                            enrichedTrackers.push({ ...tracker, latestEvent: events[index] })
                        })

                        setTrackers(enrichedTrackers)

                    })

            })
            .catch(error => console.error(error))

    }, [])

    return (
        <>
            <div className="content">
                <h1>Trackers</h1>
            </div>
            <div className="buttons">
                <Link to="/tracker" className="button is-success">Create Tracker</Link>
            </div>
            <table className="table" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Latest Event</th>
                        <th>Time Since Last Event</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {!trackers &&
                        <tr>
                            <td colSpan="4">
                                <p>Loading...</p>
                            </td>
                        </tr>
                    }
                    {trackers && trackers.length == 0 &&
                        <tr>
                            <td colSpan="4">
                                <p className="is-italic has-text-centered m-4">No trackers have been created. You can create a tracker <Link to="/tracker">here</Link>.</p>
                            </td>
                        </tr>
                    }
                    {trackers && trackers.map((tracker, index) => {
                        return (
                            <tr key={index}>
                                <td>{tracker.name}</td>
                                <td>
                                    {tracker.latestEvent && 
                                        <Link to={`/event?id=${tracker.latestEvent.id}`}>{tracker.latestEvent.date} at {tracker.latestEvent.time}</Link>
                                    }
                                    {!tracker.latestEvent && <Link to={`/event?trackerid=${tracker.id}`}>Track first event</Link>}
                                </td>
                                <td></td>
                                <td>
                                    <div className="buttons is-right">
                                        <Link to={`/tracker?id=${tracker.id}`} className="button">View Tracker</Link>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Trackers
