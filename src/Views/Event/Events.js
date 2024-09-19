import { useEffect, useState } from "react"
import { getAllEvents, getAllTrackers } from "../../IndexedDB/IndexedDB"
import { Link } from "react-router-dom"
import { getEventDate, timeSinceDateArray } from "../../DateHelperFunctions"

const Events = () => {

    const [events, setEvents] = useState()

    useEffect(() => {

        // Get all the trackers and create a key value pair between tracker ids and tracker names
        getAllTrackers()
            .then(trackers => {

                // Create key value pairs to quickly identify the names of trackers
                const trackerNames = {}
                trackers.forEach(tracker => trackerNames[tracker.id] = tracker.name)

                // Get all the events and add any data pertinent to the rest of the application.
                getAllEvents()
                    .then(events => {

                        const enrichedEvents = []
                        events.forEach(event => {

                            enrichedEvents.push({
                                ...event,
                                trackerName: trackerNames[event.trackerId],
                                timeSinceDateArray: timeSinceDateArray(getEventDate(event))
                            })

                        })

                        enrichedEvents.sort((a, b) => 
                            getEventDate(b) - getEventDate(a)
                        )

                        setEvents(enrichedEvents)

                    })
                    .catch(error => console.error(error))

            })
            .catch(error => console.error(error))

    }, [])

    useEffect(() => {

        // Don't do anything until events has been created 
        if (events) {

            // Set an interval to update the timeSinceLastEventArrays for every tracker every second
            const interval = setInterval(() => {

                // Update the timeSinceLastEventDateArray for every tracker
                const updatedEvents = events.map(event => {

                    return {
                        ...event,
                        timeSinceDateArray: timeSinceDateArray(getEventDate(event))
                    }

                })

                setEvents(updatedEvents)

            }, 1000)

            // Return a function that will clean up the interval when the component unmounts
            return () => clearInterval(interval)

        }

    }, [events])

    return (
        <>
            <div className="content">
                <h1>Events</h1>
            </div>
            <table className="table" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Event</th>
                        <th>Tracker</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Occurred</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {!events &&
                        <tr>
                            <td colSpan="6">
                                <p>Loading...</p>
                            </td>
                        </tr>
                    }
                    {events && events.length === 0 &&
                        <tr>
                            <td colSpan="6">
                                <p className="is-italic has-text-centered m-4">No events have been tracked.</p>
                            </td>
                        </tr>
                    }
                    {events && events.map((event, index) => {
                        return (
                            <tr key={index}>
                                <td><Link to={`/event?id=${event.id}`}>Link</Link></td>
                                <td>
                                    <Link to={`/tracker?id=${event.trackerId}`}>
                                        {event.trackerName ?? <span className="is-italic">Unnamed Tracker</span>}
                                    </Link>
                                </td>
                                <td>{event.date}</td>
                                <td>{event.time}</td>
                                <td>
                                    {event.timeSinceDateArray[0].number} {event.timeSinceDateArray[0].unit} ago
                                </td>
                                <td>
                                    {event.description ?? <span className="is-italic">No description.</span>}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Events
