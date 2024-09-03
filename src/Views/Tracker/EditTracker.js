import { useEffect, useState } from "react"
import Input from "../../Shared/Bulma/Input"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getTracker, putTracker } from "../../IndexedDB/IndexedDB"

const EditTracker = () => {
    
    const [tracker, setTracker] = useState()
    
    const { trackerId } = useParams()
    
    const navigate = useNavigate()

    // TODO: Redirect if an ID has not been passed in.

    useEffect(() => {

        getTracker(Number(trackerId))
            .then(tracker => {
                setTracker(tracker)
            })
            .catch(error => {
                console.error(error)
            })

    }, [trackerId])

    const handleSubmit = (event) => {

        event.preventDefault()

        putTracker(tracker)
        navigate(`/tracker/${trackerId}`)

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Edit Tracker</h1>
            </div>
            { tracker &&
            <form onSubmit={handleSubmit}>
                <Input label="Tracker Name" defaultValue={tracker.name} onChange={event => setTracker({ ...tracker, name: event.target.value })}/>
                <div className="buttons is-centered">
                    <Link to={`/tracker/${trackerId}`} className="button">Cancel</Link>
                    <button type="submit" className="button is-success">Edit</button>
                </div>
            </form> 
            }
        </div>
    )

}
 
export default EditTracker
