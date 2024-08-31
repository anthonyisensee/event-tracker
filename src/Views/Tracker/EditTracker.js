import { useEffect, useState } from "react"
import Input from "../../Shared/Bulma/Input"
import { useLocation, useNavigate } from "react-router-dom"
import { getTracker, putTracker } from "../../IndexedDB/IndexedDB"

const EditTracker = () => {
    
    const navigate = useNavigate()

    const location = useLocation()
    const { id } = location.state

    // TODO: Redirect if an ID has not been passed in.

    const [tracker, setTracker] = useState(undefined)

    useEffect(() => {

        async function asyncFunction() {

            setTracker(await getTracker(id))

        }

        asyncFunction()

    }, [])

    const handleSubmit = (event) => {

        event.preventDefault()

        putTracker(tracker)
        navigate(-1)

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Edit Tracker</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Input label="Tracker Name" defaultValue={tracker && tracker.name} onChange={(e) => { tracker.name = e.target.value }}/>
                <div className="buttons is-centered">
                    <button type="button" onClick={() => navigate(-1)} className="button">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="button is-success">Edit</button>
                </div>
            </form>
        </div>
    )

}
 
export default EditTracker
