import { useState } from "react"
import { Link } from "react-router-dom"

const ServiceCard = (props) => {

    const service = props.service

    const [timeSinceArray, setTimeSinceArray] = useState(service.timeSinceLastEventArray)

    setTimeout(() => {
        setTimeSinceArray(service.timeSinceLastEventArray)
    }, 500)

    return (
        <div className="box">
            <div className="content has-text-centered">
                <h3>{service.name}</h3>
            </div>
            <div className="time-since has-text-centered is-flex is-justify-content-center">
                {timeSinceArray
                    .map((time, index) => (
                    
                    <div className="m-3" key={index}>
                        <p className="number is-size-3">{time.number}</p>
                        <p className="unit is-size-6">{time.unit}{time.number === 1 ? "" : "s"}</p>
                    </div>
                ))}
            </div>
            <div className="content has-text-centered">
                <p>since the <Link>last event</Link>.</p>
            </div>
            <div className="buttons is-centered">
                <button className="button is-info">Dashboard</button>
                <button className="button is-success">Log Event</button>
            </div>
        </div>
    );
}
 
export default ServiceCard
