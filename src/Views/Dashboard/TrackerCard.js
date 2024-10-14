import { Link, useLocation } from "react-router-dom"
import TimeDisplay from "../../Shared/TimeDisplay"

const TrackerCard = ({ tracker }) => {

    const location = useLocation()

    return (
        <div className="box is-flex is-flex-direction-column is-justify-content-space-between" style={{ height: "100%" }}>
            {tracker && <>
                <div className="content has-text-centered mb-3">
                    <h2 className="is-size-4 mb-0">{tracker.name ?? (<span className="is-italic">Unnamed Tracker</span>)}</h2>
                </div>
                <TimeDisplay 
                    tracker={tracker}
                    timesContainerClassName={"ml-1 mr-1 mb-3"}
                    timesClassName={"is-size-4"}
                    unitsClassName={"is-size-7"}
                    descriptionClassName={"is-size-6 mb-4"}
                />
                <div className="buttons is-centered">
                    <Link to={`/tracker?id=${tracker.id}`} className="button">View Tracker</Link>
                    <Link to={`/event?trackerid=${tracker.id}`} state={{ referrer: location.pathname }} className="button is-warning">New Event</Link>
                </div>
            </>}
        </div>
    )
}
 
export default TrackerCard
