import ServiceCard from "./ServiceCard"
import { Event } from "../../Models/Event"
import { Service } from "../../Models/Service"
import { Link } from "react-router-dom"

const Services = () => {

    const sampleEvent = new Event({
        date: new Date("2024-08-26 07:29"),
        description: "Something bad happened."
    })

    const sampleService = new Service({
        name: "Example Service",
        events: [sampleEvent]
    })

    const service = sampleService

    const numCells = 5

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Tracked Services</h1>
            </div>
            <div className="fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop has-3-cols-widescreen has-5-cols-fullhd">
                <div className="grid">
                    {Array.from({ length: numCells }).map((item, index) => (
                        <div className="cell" key={index}>
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="buttons is-centered">
                <Link to="/service/create" className="button is-success">Create New Service</Link>
            </div>
        </div>
    )

}
 
export default Services