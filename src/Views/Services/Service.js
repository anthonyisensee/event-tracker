import { useState } from "react"
import { Event } from "../../Models/Event"
import { Service as ServiceObject } from "../../Models/Service"

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
        <section className="section">
            <div className="content has-text-centered">
                <h1>{service.name}</h1>
            </div>
            <div className="time-since has-text-centered is-flex is-justify-content-center">
                {timeSinceArray.map((time, index) => (
                    <div className="m-5" key={index}>
                        <p className="number is-size-1 has-text-weight-semibold">{time.number}</p>
                        <p className="unit is-size-5">{time.unit}{time.number === 1 ? "" : "s"}</p>
                    </div>
                ))}
            </div>
            <div className="content has-text-centered is-size-5">
                <p>since the last event</p>
            </div>
            <div className="content">
                <h2>Events</h2>
                {service.events.map((event, index) => {
                    console.log(event)
                    return (
                        <p key={index}>{event.date.toISOString()} - {event.description}</p>
                    )
                })}
                <p></p>
            </div>
        </section>
    )

}
 
export default Service;