import TrackerCard from "./TrackerCard"
import { Event } from "../../Models/Event"
import { Tracker } from "../../Models/Tracker"
import { Link } from "react-router-dom"

const Trackers = () => {

    const sampleEvent = new Event({
        date: new Date("2024-08-26 07:29"),
        description: "Something bad happened."
    })

    const sampleTracker = new Tracker({
        name: "Example Tracker",
        events: [sampleEvent]
    })

    const tracker = sampleTracker

    const numCells = 5

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Trackers</h1>
            </div>
            <div className="fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop has-3-cols-widescreen has-5-cols-fullhd">
                <div className="grid">
                    {Array.from({ length: numCells }).map((item, index) => (
                        <div className="cell" key={index}>
                            <TrackerCard tracker={tracker} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="buttons is-centered">
                <Link to="/tracker/create" className="button is-success">Create New Tracker</Link>
            </div>
        </div>
    )

}
 
export default Trackers
