import { useState } from "react"
import TextArea from "../../Shared/Bulma/TextArea"
import Input from "../../Shared/Bulma/Input"
import { Link, useNavigate, useParams } from "react-router-dom"
import { addEvent } from "../../IndexedDB/IndexedDB"

const CreateEvent = () => {

    const [eventDate, setEventDate] = useState()
    const [eventDescription, setEventDescription] = useState()

    const { trackerId } = useParams()

    const navigate = useNavigate()

    const handleSubmit = (event) => {

        event.preventDefault()

        const eventObject = { 
            date: eventDate, 
            description: eventDescription, 
            trackerId: Number(trackerId) 
        }

        addEvent(eventObject)
            .catch((error) => console.error(error))

        navigate(`/tracker/${trackerId}`)

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Create New Event</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Input label="Event Date" onChange={(e) => setEventDate(e.target.value)}/>
                <TextArea label="Event Description" onChange={(e) => setEventDescription(e.target.value)}/>
                <div className="buttons is-centered">
                    <Link to={`/tracker/${trackerId}`} className="button">Cancel</Link>
                    <button type="submit" className="button is-success">Create</button>
                </div>
            </form>
        </div>
    )

}

export default CreateEvent
