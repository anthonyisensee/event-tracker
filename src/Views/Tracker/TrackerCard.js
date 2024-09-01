// import { useState } from "react"
import { Link } from "react-router-dom"

const TrackerCard = ({ tracker }) => {

    // const [timeSinceArray, setTimeSinceArray] = useState(tracker.timeSinceLastEventArray)

    // setTimeout(() => {
    //     setTimeSinceArray(tracker.timeSinceLastEventArray)
    // }, 1000)

    return (
        <div className="box">
            <div className="content has-text-centered">
                <h3>{tracker.name}</h3>
            </div>
            <div className="time-since has-text-centered is-flex is-justify-content-center">
                {/* {timeSinceArray.map((time, index) => (
                    <div className="m-2" key={index}>
                        <p className="number is-size-4">{time.number}</p>
                        <p className="unit is-size-7">{time.unit}{time.number === 1 ? "" : "s"}</p>
                    </div>
                ))} */}
            </div>
            <div className="content has-text-centered is-size-6">
                <p>has passed since the last event.</p>
            </div>
            <div className="buttons is-centered">
                <Link to={`/tracker/${tracker.id}`} className="button" state={{ id: tracker.id }}>View Details</Link>
                <Link to="/event/create" className="button is-warning">Log New Event</Link>
            </div>
        </div>
    );
}
 
export default TrackerCard
