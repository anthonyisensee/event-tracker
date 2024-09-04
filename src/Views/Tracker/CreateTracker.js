import { useState } from "react"
import Input from "../../Shared/Bulma/Input"
import { useNavigate, Link } from "react-router-dom"
import { addTracker } from "../../IndexedDB/IndexedDB"

const CreateTracker = () => {
    
    const navigate = useNavigate()
    
    const [tracker, setTracker] = useState({})

    const handleSubmit = (event) => {

        event.preventDefault()

        addTracker(tracker)

        // TODO: Figure out how to navigate to tracker page after creating tracker. Also update Link below.
        navigate("/")

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Create New Tracker</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Input label="Tracker Name" onChange={ (event) => setTracker({ ...tracker, name: event.target.value }) }/>
                <div className="buttons is-centered">
                    <Link to={"/"} className="button">Cancel</Link>
                    <button type="submit" className="button is-success">Create</button>
                </div>
            </form>
        </div>
    )

}

export default CreateTracker
