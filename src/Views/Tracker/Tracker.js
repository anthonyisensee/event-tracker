import { useState } from "react"
import { Event } from "../../Models/Event"
import { Tracker as TrackerObject } from "../../Models/Tracker"
import { Link } from "react-router-dom"

const Tracker = () => {

    const sampleEvent1 = new Event({
        date: new Date("2024-03-26 07:29"),
        description: "Dave tripped into the flamethrower."
    })

    const sampleEvent2 = new Event({
        date: new Date("2024-08-26 07:29"),
        description: "Bob fell into the wood chipper."
    })

    const sampleTracker = new TrackerObject({
        name: "Example Tracker",
        events: [sampleEvent1, sampleEvent2]
    })

    const tracker = sampleTracker

    const [timeSinceArray, setTimeSinceArray] = useState(tracker.timeSinceLastEventArray)

    setTimeout(() => {
        setTimeSinceArray(tracker.timeSinceLastEventArray)
    }, 1000)

    return (
        <div>
            <div className="content has-text-centered">
                <h1>{tracker.name}</h1>
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
                <Link to="/tracker/edit" state={{ tracker }} className="button">Edit Tracker</Link>
                <button className="button is-danger">Delete Tracker</button>
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
                    {tracker.events.map((event, index) => {
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

export default Tracker
