import { useEffect, useState } from "react"
import Input from "../../Shared/Bulma/Input"
import { useNavigate, useParams } from "react-router-dom"
import { getTracker, putTracker } from "../../IndexedDB/IndexedDB"

const EditTracker = () => {
    
    const [tracker, setTracker] = useState(undefined)
    
    const { id } = useParams()
    
    const navigate = useNavigate()

    // TODO: Redirect if an ID has not been passed in.

    useEffect(() => {

        getTracker(Number(id))
            .then(tracker => {
                setTracker(tracker)
            })
            .catch(error => {
                console.error(error)
            })

    }, [id])

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
                    <button type="submit" className="button is-success">Edit</button>
                </div>
            </form>
        </div>
    )

}
 
export default EditTracker
