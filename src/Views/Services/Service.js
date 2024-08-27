import { useState } from "react"
import { Event } from "../../Models/Event"
import { Service as ServiceObject } from "../../Models/Service"
import { Link } from "react-router-dom"

const Service = () => {

    const sampleEvent1 = new Event({
        date: new Date("2024-03-26 07:29"),
        description: "Dave tripped into the flamethrower."
    })

    const sampleEvent2 = new Event({
        date: new Date("2024-08-26 07:29"),
        description: "Bob fell into the wood chipper."
    })

    const sampleService = new ServiceObject({
        name: "Example Service",
        events: [sampleEvent1, sampleEvent2]
    })

    const service = sampleService

    const [timeSinceArray, setTimeSinceArray] = useState(service.timeSinceLastEventArray)

    setTimeout(() => {
        setTimeSinceArray(service.timeSinceLastEventArray)
    }, 1000)

    return (
        <div>
            <div className="content has-text-centered">
                <h1>{service.name}</h1>
            </div>
            <div className="time-since has-text-centered is-flex is-justify-content-center">
                {timeSinceArray.map((time, index) => (
                    <div className="mb-5 ml-5 mr-5" key={index}>
                        <p className="number is-size-1 has-text-weight-bold">{time.number}</p>
                        <p className="unit is-size-5">{time.unit}{time.number === 1 ? "" : "s"}</p>
                    </div>
                ))}
            </div>
            <div className="content has-text-centered is-size-4">
                <p>has passed since the last event.</p>
            </div>
            <div className="buttons is-centered mt-6">
                <Link to="edit" className="button">Edit Service</Link>
                <button className="button is-danger">Delete Service</button>
            </div>
            <br />
            <br />
            <div className="content mt-6">
                <h2 className="has-text-centered">Events</h2>
            </div>
            <table className="table is-fullwidth">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {service.events.map((event, index) => {
                        return (
                            <tr key={index}>
                                <td>{event.date.toISOString()}</td>
                                <td>{event.description}</td>
                                <td>
                                    <div className="buttons is-right">
                                        <Link to="/event/edit" className="button">Edit</Link>
                                        <button className="button is-danger">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="buttons is-centered mt-6">
                <Link to="/event/create" className="button is-warning">Log New Event</Link>
            </div>
        </div>
    )

}

export default Service