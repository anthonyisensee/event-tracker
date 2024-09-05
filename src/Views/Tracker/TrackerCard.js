import { useState } from "react"
import { Link } from "react-router-dom"
import { timeSinceLastEventArray } from "../../DateHelperFunctions"

const TrackerCard = ({ tracker }) => {

    const date = tracker.mostRecentEvent ? new Date(`${tracker.mostRecentEvent.date} ${tracker.mostRecentEvent.time}`) : null

    const [timeSinceArray, setTimeSinceArray] = useState(timeSinceLastEventArray(date))

    setTimeout(() => {
        setTimeSinceArray(timeSinceLastEventArray(date))
    }, 1000)

    return (
        <div className="box">
            <div className="content has-text-centered">
                <h3>{tracker.name}</h3>
            </div>
            <div className="time-since has-text-centered is-flex is-justify-content-center">
                {timeSinceArray.map((time, index) => (
                    <div className="m-2" key={index}>
                        <p className="number is-size-4">{time.number}</p>
                        <p className="unit is-size-7">{time.unit}</p>
                    </div>
                ))}
            </div>
            <div className="content has-text-centered is-size-6">
                <p>{timeSinceArray[timeSinceArray.length - 1].isPlural ? "have" : "has"} passed since {tracker.mostRecentEvent ? "the" : "there is no"} last event.</p>
            </div>
            <div className="buttons is-centered">
                <Link to={`/tracker/${tracker.id}`} className="button">View Details</Link>
                <Link to={`/event/create/${tracker.id}`} className="button is-warning">Log New Event</Link>
            </div>
        </div>
    )
}
 
export default TrackerCard
