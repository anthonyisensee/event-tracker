import { useEffect, useState, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import { getEventDate, timeSinceDateArray } from "../../DateHelperFunctions"
import { getLastEventWithTrackerId } from "../../IndexedDB/IndexedDB"
import TimeDisplay from "../../Shared/TimeDisplay"

const TrackerCard = ({ tracker }) => {

    const [latestEvent, setLatestEvent] = useState()
    const [timeSinceArray, setTimeSinceArray] = useState(timeSinceDateArray(null))
    const [timeBetweenObject, setTimeBetweenObject] = useState()

    const location = useLocation()

    const getAndSetLatestEvent = useCallback(async (trackerId) => {

        getLastEventWithTrackerId(trackerId)
            .then(event => setLatestEvent(event))
            .catch(error => console.error(error))

    }, [])

    useEffect(() => {

        getAndSetLatestEvent(tracker.id)

    }, [tracker.id, getAndSetLatestEvent])

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

    return (
        <div className="box is-flex is-flex-direction-column is-justify-content-space-between" style={{ height: "100%" }}>
            {tracker && <>
                <div className="content has-text-centered mb-3">
                    <h2 className="is-size-4 mb-0">{tracker.name ?? (<span className="is-italic">Unnamed Tracker</span>)}</h2>
                </div>
                <TimeDisplay 
                    tracker={tracker}
                    timesContainerClassName={"ml-1 mr-1 mb-3"}
                    timesClassName={"is-size-4"}
                    unitsClassName={"is-size-7"}
                    descriptionClassName={"is-size-6 mb-4"}
                />
                <div className="buttons is-centered">
                    <Link to={`/tracker?id=${tracker.id}`} className="button">View Tracker</Link>
                    <Link to={`/event?trackerid=${tracker.id}`} state={{ referrer: location.pathname }} className="button is-warning">New Event</Link>
                </div>
            </>}
        </div>
    )
}
 
export default TrackerCard
