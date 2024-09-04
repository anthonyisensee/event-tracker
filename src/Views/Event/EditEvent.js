import { useEffect, useState } from "react"
import Input from "../../Shared/Bulma/Input"
import TextArea from "../../Shared/Bulma/TextArea"
import { useNavigate, useParams, Link } from "react-router-dom"
import { getEvent, putEvent } from "../../IndexedDB/IndexedDB"

const EditEvent = () => {

    const params = useParams()
    const eventId = Number(params.eventId)
    
    const navigate = useNavigate()
    
    const [event, setEvent] = useState()

    // TODO: Redirect or display an error message if no or an invalid id has been passed in.

    useEffect(() => {

        getEvent(eventId)
            .then(event => {
                setEvent(event)
            })
            .catch(error => {
                console.error(error)
            })

    }, [eventId])

    const handleSubmit = (submitEvent) => {

        submitEvent.preventDefault()

        putEvent(event)
        navigate(`/tracker/${event.trackerId}`)

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Edit Event</h1>
            </div>
            { event &&
            <form onSubmit={handleSubmit}>
                <Input label="Event Date" defaultValue={event && event.date} onChange={ e => event.date = e.target.value }/>
                <TextArea label="Event Description" defaultValue={event && event.description} onChange={ e => event.description = e.target.value }/>
                <div className="buttons is-centered">
                    { event && <Link to={`/tracker/${event.trackerId}`} className="button">Cancel</Link> }
                    <button type="submit" className="button is-success">Edit</button>
                </div>
            </form>
            }
        </div>
    )

}
 
export default EditEvent
