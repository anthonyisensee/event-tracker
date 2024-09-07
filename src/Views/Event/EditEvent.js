import { useEffect, useState } from "react"
import Input from "../../Shared/Bulma/Input"
import TextArea from "../../Shared/Bulma/TextArea"
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"
import { getEvent, putEvent } from "../../IndexedDB/IndexedDB"
import { currentInputDate, currentInputTime } from "../../DateHelperFunctions"


const EditEvent = () => {

    const params = useParams()
    const eventId = Number(params.eventId)
    
    const navigate = useNavigate()

    const location = useLocation()
    const { referrer: customReferrer } = location.state || {}
    
    const [event, setEvent] = useState()
    const [maxDate, setMaxDate] = useState(currentInputDate())
    const [maxTime, setMaxTime] = useState(currentInputTime())
    const [defaultReferrer, setDefaultReferrer] = useState('/')
    

    // TODO: Redirect or display an error message if no or an invalid id has been passed in.

    useEffect(() => {

        getEvent(eventId)
            .then(eventObject => {
                setEvent(eventObject)
                setDefaultReferrer(`/tracker/${eventObject.trackerId}`)
            })
            .catch(error => console.error(error))

    }, [eventId])

    const handleSubmit = (submitEvent) => {

        submitEvent.preventDefault()

        putEvent(event)
        navigate(customReferrer ? customReferrer : defaultReferrer)

    }

    function handleCreateOnEdit() {
        setMaxDate(currentInputDate())
        setMaxTime(currentInputTime())
    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Edit Event</h1>
            </div>
            { event &&
                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Event Date"
                        type="date"
                        defaultValue={event.date}
                        onChange={ e => setEvent({ ...event, date: e.target.value}) }
                        required={"required"}
                        max={maxDate}
                    />
                    <Input 
                        label="Event Time"
                        type="time"
                        step="1"
                        defaultValue={event.time}
                        onChange={ e => setEvent({ ...event, time: e.target.value}) }
                        required={"required"}
                        max={maxTime}
                    />
                    <TextArea 
                        label="Event Description"
                        defaultValue={event.description}
                        onChange={ e => setEvent({ ...event, description: e.target.value}) }
                    />
                    <div className="buttons is-centered">
                        <Link to={customReferrer ? customReferrer : defaultReferrer} className="button">Cancel</Link>
                            <button onClick={handleCreateOnEdit} type="submit" className="button is-success">Edit</button>
                    </div>
                </form>
            }
        </div>
    )

}
 
export default EditEvent
