import TrackerCard from "./TrackerCard"
// import { Event } from "../../Models/Event"
import { Tracker } from "../../Models/Tracker"
import { Link } from "react-router-dom"
import { getAllTrackers } from "../../IndexedDB/IndexedDB"
import { useEffect, useState } from "react"

const Trackers = () => {

    const [trackers, setTrackers] = useState()

    useEffect(() => {

        async function asyncFunction() {

            setTrackers(await getAllTrackers())

        }

        asyncFunction()

    }, [])

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Trackers</h1>
            </div>
            <div className="fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop has-3-cols-widescreen has-5-cols-fullhd">
                <div className="grid">
                    {trackers && trackers.map((item, index) => {

                        const tracker = new Tracker(item)

                        return (
                            <div className="cell" key={index}>
                                <TrackerCard tracker={item} />
                            </div>
                        )

                    })}
                </div>
            </div>
            <div className="buttons is-centered">
                <Link to="/tracker/create" className="button is-success">Create New Tracker</Link>
            </div>
        </div>
    )

}
 
export default Trackers
