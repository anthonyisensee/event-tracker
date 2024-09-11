import { useEffect, useState, useCallback } from "react"
import { Link, useLocation } from "react-router-dom"
import { getEventDate, timeSinceDateArray } from "../../DateHelperFunctions"
import { getLatestEventWithTrackerId } from "../../IndexedDB/IndexedDB"

const TrackerCard = ({ tracker }) => {

    const [latestEvent, setLatestEvent] = useState()
    const [timeSinceArray, setTimeSinceArray] = useState()

    const location = useLocation()

    const getAndSetLatestEvent = useCallback(async (trackerId) => {

        getLatestEventWithTrackerId(trackerId)
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
        <div className="box">
            {tracker && <>
                <div className="content has-text-centered">
                    <h3>{tracker.name}</h3>
                </div>
                {timeSinceArray && <>
                    <div className="time-since has-text-centered is-flex is-justify-content-center">
                        {timeSinceArray.map((time, index) => (
                            <div className="m-2" key={index}>
                                <p className="number is-size-4">{time.number}</p>
                                <p className="unit is-size-7">{time.unit}</p>
                            </div>
                        ))}
                    </div>
                    <div className="content has-text-centered is-size-6">
                        <p>
                            {timeSinceArray[timeSinceArray.length - 1].isPlural ? "have" : "has"} passed since {latestEvent ? "the" : "there is no"} {latestEvent ? <Link to={`/event?id=${latestEvent.id}`} state={{ referrer: location.pathname }}>latest event</Link> : "latest event."}.
                        </p>
                    </div>
                </>}
                <div className="buttons is-centered">
                    <Link to={`/tracker?id=${tracker.id}`} className="button">View Details</Link>
                    <Link to={`/event?trackerid=${tracker.id}`} state={{ referrer: location.pathname }} className="button is-warning">Create Event</Link>
                </div>
            </>}
        </div>
    )
}
 
export default TrackerCard
