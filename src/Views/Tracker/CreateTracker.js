import { useState } from "react"
import Input from "../../Shared/Bulma/Input"
import { useNavigate } from "react-router-dom"
import IndexedDB from "../../IndexedDB/IndexedDB"

const CreateTracker = () => {

    const [trackerName, setTrackerName] = useState()

    const navigate = useNavigate()

    const handleSubmit = (event) => {

        event.preventDefault()

        createTracker()

        console.log("created new tracker")

    }

    const createTracker = () => {

        const idb = new IndexedDB()

        debugger

        idb.db
            .transaction("trackers", "readwrite")
            .objectStore("trackers")
            .add({ name: trackerName })

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Create New Tracker</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Input label="Tracker Name" onChange={(e) => setTrackerName(e.target.value)}/>
                <div className="buttons is-centered">
                    <button onClick={() => navigate(-1)} className="button">Cancel</button>
                    <button className="button is-success">Create</button>
                </div>
            </form>
        </div>
    )

}

export default CreateTracker
