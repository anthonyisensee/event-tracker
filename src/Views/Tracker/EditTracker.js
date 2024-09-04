import { useEffect, useState } from "react"
import Input from "../../Shared/Bulma/Input"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getTracker, putTracker } from "../../IndexedDB/IndexedDB"

const EditTracker = () => {
    
    const params = useParams()
    const trackerId = Number(params.trackerId)
    
    const navigate = useNavigate()
    
    const [tracker, setTracker] = useState()

    // TODO: Redirect or display an error message if no or an invalid id has been passed in.

    useEffect(() => {

        getTracker(trackerId)
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
