import Input from "../../Shared/Bulma/Input"
import { useNavigate } from "react-router-dom"

const CreateTracker = () => {

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        
        event.preventDefault()

        console.log("form submitted")

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Create New Tracker</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Input label="Tracker Name"/>
                <div className="buttons is-centered">
                    <button onClick={() => navigate(-1)} className="button">Cancel</button>
                    <button className="button is-success">Create</button>
                </div>
            </form>
        </div>
    )

}
 
export default CreateTracker
