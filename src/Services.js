import ServiceCard from "./ServiceCard";
import { Event } from "./Models/Event"
import { Service } from "./Models/Service"

const Services = () => {

    const sampleEvent = new Event({
        date: new Date("2024-07-01 13:24"),
        description: "Something bad happened."
    })

    const sampleService = new Service({
        name: "Example Service",
        events: [sampleEvent]
    })

    const service = sampleService

    return (

        <div className="container grid is-col-min-18">
            <div className="cell">
                <ServiceCard service={service} />
            </div>
            <div className="cell">
                <ServiceCard service={service} />
            </div>
            <div className="cell">
                <ServiceCard service={service} />
            </div>
            <div className="cell">
                <ServiceCard service={service} />
            </div>
            <div className="cell">
                <ServiceCard service={service} />
            </div>
        </div>    

    );

}
 
export default Services;