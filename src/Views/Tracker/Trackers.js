import { useState, useEffect } from "react"
import { getAllTrackers, getMostRelevantEventForTracker } from "../../IndexedDB/IndexedDB"
import { Link } from "react-router-dom"
import { timeBetweenDates, getEventDate } from "../../DateHelperFunctions"
import TrackerModel from "../../Models/TrackerModel"

const Trackers = () => {

    const trackerModel = new TrackerModel()
    
    const [trackers, setTrackers] = useState()

    useEffect(() => {

        getAllTrackers()
            .then(trackers => setTrackers(trackers))
            .catch(error => console.error(error))

    }, [])

    return (
        <>
            <div className="content">
                <h1>Trackers</h1>
            </div>
            <div className="buttons">
                <Link to="/tracker" className="button is-success">Create Tracker</Link>
            </div>
            <div className="table-container">
                <table className="table" style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Tracker</th>
                            <th>Targets</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!trackers &&
                            <tr>
                                <td colSpan="2">
                                    <p>Loading...</p>
                                </td>
                            </tr>
                        }
                        {trackers && trackers.length === 0 &&
                            <tr>
                                <td colSpan="3">
                                    <p className="is-italic has-text-centered m-4">No trackers have been created. You can create a tracker <Link to="/tracker">here</Link>.</p>
                                </td>
                            </tr>
                        }
                        {trackers && trackers.map((tracker, index) => {
                            return (
                                <tr key={index}>
                                    <td><Link to={`/tracker?id=${tracker.id}`}>{tracker.name ?? <span className="is-italic">Unnamed Tracker</span>}</Link></td>
                                    <td>{trackerModel.getTrackerTargetsOptionLabel(tracker.targets)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Trackers
