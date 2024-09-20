import TrackerCard from "./TrackerCard"
import { Link } from "react-router-dom"
import { getAllTrackers } from "../../IndexedDB/IndexedDB"
import { useEffect, useState } from "react"
import { useDarkMode } from "../../Context/ThemeContext";

const Dashboard = () => {

    const [trackers, setTrackers] = useState();
    const { isDarkMode } = useDarkMode();

    useEffect(() => {

        getAllTrackers()
            .then(trackers => setTrackers(trackers))
            .catch(error => console.error(error))
    }, [])

    return (
        <div >
            <div className="content has-text-centered" >
                <h1>Dashboard</h1>
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
                <Link to="/tracker" className="button is-success" state={{referrer: "/dashboard"}}>Create New Tracker</Link>
            </div>
        </div>
    )

}
 
export default Dashboard
