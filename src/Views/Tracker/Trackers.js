import { useState, useEffect } from "react"
import { getAllTrackers, getLatestEventWithTrackerId } from "../../IndexedDB/IndexedDB"
import { Link } from "react-router-dom"
import { timeSinceDateArray, getEventDate } from "../../DateHelperFunctions"

const Trackers = () => {

    const [trackers, setTrackers] = useState()

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

    // 
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
            <div className="table-container">
                <table className="table" style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Tracker</th>
                            <th>Last Event</th>
                            <th>Last Event Was</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!trackers &&
                            <tr>
                                <td colSpan="3">
                                    <p>Loading...</p>
                                </td>
                            </tr>
                        }
                        {trackers && trackers.length === 0 &&
                            <tr>
                                <td colSpan="3">
                                    <p className="is-italic has-text-centered m-4">No trackers have been created. You can create a tracker <Link to="/tracker">here</Link>.</p>
                                </td>
                            </tr>
                        }
                        {trackers && trackers.map((tracker, index) => {
                            return (
                                <tr key={index}>
                                    <td><Link to={`/tracker?id=${tracker.id}`}>{tracker.name ?? <span className="is-italic">Unnamed Tracker</span>}</Link></td>
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
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Trackers
