import ServiceCard from "./ServiceCard";
import { Event } from "../../Models/Event"
import { Service } from "../../Models/Service"

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

    const numCells = 11

    return (

        <section className="section">
            <div className="container fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop has-3-cols-widescreen has-5-cols-fullhd">
                <div className="grid">
                    {Array.from({ length: numCells }).map((item, index) => (
                        <div className="cell">
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );

}
 
export default Services;