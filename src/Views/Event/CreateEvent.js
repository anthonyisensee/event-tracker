import { useState } from "react"
import TextArea from "../../Shared/Bulma/TextArea"
import Input from "../../Shared/Bulma/Input"
import { Link, useNavigate, useParams } from "react-router-dom"
import { addEvent } from "../../IndexedDB/IndexedDB"

const CreateEvent = () => {

    const params = useParams()
    const trackerId = Number(params.trackerId)

    const navigate = useNavigate()

    const [event, setEvent] = useState({ trackerId, date: currentInputDate(), time: currentInputTime() })

    const handleSubmit = (submitEvent) => {

        submitEvent.preventDefault()

        addEvent(event)
            .catch((error) => console.error(error))

        navigate(`/tracker/${trackerId}`)

    }

    function currentInputDate() {

        const date = new Date()
        const yyyy = String(date.getFullYear())
        const mm = String(date.getMonth() + 1).padStart(2, "0")
        const dd = String(date.getDay()).padStart(2, "0")
        return `${yyyy}-${mm}-${dd}`

    }

    function currentInputTime() {

        const date = new Date()
        const hh = String(date.getHours()).padStart(2, "0")
        const mm = String(date.getMinutes()).padStart(2, "0")
        const ss = String(date.getSeconds()).padStart(2, "0")
        return `${hh}:${mm}:${ss}`

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Create New Event</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Input 
                    label="Event Date"
                    type="date"
                    defaultValue={event.date}
                    onChange={ e => setEvent({ ...event, date: e.target.value }) }
                    required={"required"}
                />
                <Input 
                    label="Event Time"
                    type="time"
                    step="1"
                    defaultValue={event.time}
                    onChange={ e => setEvent({ ...event, time: e.target.value }) }
                    required={"required"}
                />
                <TextArea 
                    label="Event Description"
                    onChange={ e => setEvent({ ...event, description: e.target.value }) }
                />
                <div className="buttons is-centered">
                    <Link to={`/tracker/${trackerId}`} className="button">Cancel</Link>
                    <button type="submit" className="button is-success">Create</button>
                </div>
            </form>
        </div>
    )

}

export default CreateEvent
