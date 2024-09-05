import TrackerCard from "./TrackerCard"
import { Link } from "react-router-dom"
import { getAllTrackers, getMostRecentEventWithTrackerId } from "../../IndexedDB/IndexedDB"
import { useEffect, useState } from "react"

const Trackers = () => {

    const [trackers, setTrackers] = useState()

    useEffect(() => {

        getAllTrackers()
            .then(trackers => {

                // Create a new array of promises that will resolve to tracker objects with a mostRecentEvent property
                const promises = trackers.map(tracker => 
                    
                    // Get most recent event for each tracker (or null if it does not exist)
                    getMostRecentEventWithTrackerId(tracker.id)
                        .then(mostRecentEvent => {

                            // Add the most recent event to the object and return a promise for it
                            return { ...tracker, mostRecentEvent }

                        })

                )

                // Promise.all() returns a single promise that will resolve only when all sub-promises resolve.
                const newTrackers = Promise.all(promises)

                // Return the promise for the array of enriched tracker objects.
                return newTrackers

            })
            .then(trackers => {
                setTrackers(trackers)
            })
            .catch(error => {
                console.error(error)
            })

    }, [])

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Trackers</h1>
            </div>
            <div className="fixed-grid has-1-cols-mobile has-2-cols-tablet has-3-cols-desktop has-3-cols-widescreen has-5-cols-fullhd">
                <div className="grid">
                    {trackers && trackers.map((item, index) => {
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
