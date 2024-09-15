import { useState, useEffect, useCallback } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { addEvent, getEvent, putEvent, deleteEvent } from "../../IndexedDB/IndexedDB"
import { currentInputDate, currentInputTime } from "../../DateHelperFunctions"
import Modal from "../../Shared/Bulma/Modal"

const Event = () => {

    const [params] = useSearchParams()
    const eventId = Number(params.get("id"))
    const trackerId = Number(params.get("trackerid"))

    const navigate = useNavigate()

    const location = useLocation()
    const { referrer } = location.state || {}

    const [mode, setMode] = useState(trackerId && !eventId ? "create" : "view")
    const [event, setEvent] = useState({ date: currentInputDate(), time: currentInputTime() })
    const [defaultReferrer, setDefaultReferrer] = useState()
    const maxDate = currentInputDate()
    const [maxTime, setMaxTime] = useState(currentInputTime())

    const [eventDeleteModalIsActive, setEventDeleteModalIsActive] = useState(false)

    // When the page loads make sure that the correct data exist to set a mode. Otherwise, error. 
    useEffect(() => {

        if (eventId && !trackerId) {

            setMode("view")

            getEvent(eventId)
                .then(event => {
                    setEvent(event)
                    setDefaultReferrer(`/tracker?id=${event.trackerId}`)
                })
                .catch(error => console.error(error))

        } else if (trackerId && !eventId) {

            setMode("create")
            setDefaultReferrer(`/tracker?id=${trackerId}`)

        } else {

            throw new Error("Cannot set a mode based on the provided parameters.")  // TODO: Replace with an error that is shown to the user.

        }

    }, [eventId, trackerId])

    const handleSubmit = (submitEvent) => {
            
        submitEvent.preventDefault()

        if (mode === "create") {
            
            addEvent({ ...event, trackerId })   // Add the tracker ID before storing to the db
                .then(() => navigate(referrer ? referrer : defaultReferrer))
                .catch(error => console.error(error))

        } else if (mode === "edit") {
            
            putEvent(event)
                .then(() => setMode("view"))
                .catch(error => console.error(error))

        }

    }

    const updateMaxTime = useCallback((selectedDate) => {

        if (event.date === currentInputDate()) {
            setMaxTime(currentInputTime())
        } else {
            setMaxTime()
        }

    }, [event.date])

    // Update the max time on page load
    useEffect(() => {

        updateMaxTime(event.date)

    }, [event.date, updateMaxTime])

    // use effect with set timeout that updates max time ever second
    useEffect(() => {

        const interval = setInterval(() => {

            updateMaxTime(event.date)

        }, 1000)

        return () => clearInterval(interval)

    })

    const handleEventDeleteConfirm = () => {

        setEventDeleteModalIsActive(true)

    }

    const handleEventDelete = () => {

        deleteEvent(eventId)
            .then(() => navigate(defaultReferrer))
            .catch(error => console.error(error))

    }

    return (
        <div className="block">
            {event && <>
                <Modal
                    isActive={eventDeleteModalIsActive}
                    setIsActive={setEventDeleteModalIsActive}
                    onAction={handleEventDelete}
                    action="delete"
                    headerTitle="Delete event?"
                    bodyContent={
                        <div className="content">
                            <p>This will delete the event that occurred on {event.date} at {event.time}{event.description ? " with the following description:" : "."}</p>
                            <p>{event.description}</p>
                            <p className="has-text-weight-bold">Please be certain that this is what you want to do as it cannot be undone!</p>
                        </div>
                    } 
                />
                <div className="content">
                    <h1>{mode !== "view" ? `${mode.charAt(0).toUpperCase() + mode.slice(1)} `: ""}Event</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="field is-horizontal">
                        <div className="field-body">
                            <div className="field">
                                <label className="label">Date</label>
                                <div className="control">
                                    {mode === "view" && <p>{event.date}</p>}
                                    {mode !== "view" && 
                                        <input
                                            className="input"
                                            required={true}
                                            type="date"
                                            defaultValue={event.date}
                                            onChange={e => {
                                                setEvent({ ...event, date: e.target.value })
                                                updateMaxTime(e.target.value)
                                            }}
                                            max={maxDate}
                                        />}
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Time</label>
                                <div className="control">
                                    {mode === "view" && <p>{event.time}</p>}
                                    {mode !== "view" && 
                                        <input
                                            className="input"
                                            required={true}
                                            type="time"
                                            step="1"
                                            defaultValue={event.time}
                                            onChange={e => setEvent({ ...event, time: e.target.value })}
                                            max={maxTime}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Description</label>
                        <div className="control">
                            {mode === "view" && event.description && <p>{event.description}</p>}
                            {mode === "view" && !event.description && <p className="is-italic">No description provided.</p>}
                            {mode !== "view" && 
                                <textarea
                                    className="textarea"
                                    rows="5"
                                    onChange={e => setEvent({ ...event, description: e.target.value })}
                                    defaultValue={event.description}
                                ></textarea>
                            }
                        </div>
                    </div>
                    <div className="field is-grouped">
                        {mode === "view" && <>
                            <div className="control">
                                <button onClick={() => setMode("edit")} type="button" className="button">Edit</button>
                            </div>
                            <div className="control">
                                <Link to={`/tracker?id=${event.trackerId}`} className="button is-link" type="button">View Tracker</Link>
                            </div>
                            <div className="control">
                                <button onClick={handleEventDeleteConfirm} type="button" className="button is-danger">Delete</button>
                            </div>
                        </>}
                        {mode === "edit" && <>
                            <div className="control">
                                <button onClick={() => setMode("view")} className="button" type="button">Cancel</button>
                            </div>
                            <div className="control">
                                <button className="button is-success">Save</button>
                            </div>
                        </>}
                        {mode === "create" && <>
                            <div className="control">
                                <button onClick={() => navigate(referrer ? referrer : defaultReferrer)} className="button" type="button">Cancel</button>
                            </div>
                            <div className="control">
                                <button className="button is-success">Create</button>
                            </div>
                        </>}
                    </div>
                </form>
            </>}
            {!event && <p>Loading...</p>}
        </div>
    )

}

export default Event