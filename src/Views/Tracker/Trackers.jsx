import { useState, useEffect } from "react"
import { getAllTrackers, getLatestEventWithTrackerId } from "../../IndexedDB/IndexedDB"
import { Link, useLocation } from "react-router-dom"
import { timeSinceDateArray, getEventDate } from "../../DateHelperFunctions"

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

                            enrichedTrackers.push({ 
                                ...tracker, 
                                latestEvent: events[index],
                                timeSinceLastEventDateArray: timeSinceDateArray(getEventDate(events[index]))
                            })

                        })

                        setTrackers(enrichedTrackers)

                    })

            })
            .catch(error => console.error(error))

    }, [])

    useEffect(() => {

        // Don't do anything until trackers has been created 
        if (trackers) {

            // Set an interval to update the timeSinceLastEventArrays for every tracker every second
            const interval = setInterval(() => {

                // Update the timeSinceLastEventDateArray for every tracker
                const updatedTrackers = trackers.map(tracker => {

                    return {
                        ...tracker,
                        timeSinceLastEventDateArray: timeSinceDateArray(getEventDate(tracker.latestEvent))
                    }

                })

                setTrackers(updatedTrackers)

            }, 1000)

            // Return a function that will clean up the interval when the component unmounts
            return () => clearInterval(interval)

        }

    }, [trackers])


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
                        <th>Last Event On</th>
                        <th>Last Event Was</th>
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
                    {trackers && trackers.length === 0 &&
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
                                    {!tracker.latestEvent && <p className="is-italic">No events</p>}
                                </td>
                                <td>
                                    {tracker.latestEvent && tracker.timeSinceLastEventDateArray && 
                                    
                                        <p>{tracker.timeSinceLastEventDateArray[0].number} {tracker.timeSinceLastEventDateArray[0].unit} ago</p>

                                    }
                                </td>
                                <td>
                                    <div className="buttons is-right">
                                        <Link to={`/tracker?id=${tracker.id}`} className="button">View Tracker</Link>
                                        <Link to={`/event?trackerid=${tracker.id}`} state={{ referrer: location.pathname }} className="button is-warning">New Event</Link>
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
