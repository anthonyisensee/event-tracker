import Input from "../../Shared/Bulma/Input"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

const EditService = () => {

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        
        event.preventDefault()

        console.log("form submitted")

    }

    return (
        <div>
            <div className="content has-text-centered">
                <h1>Edit Service</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <Input label="Service Name"/>
                <div className="buttons is-centered">
                    <button onClick={() => navigate(-1)}className="button">Cancel</button>
                    <button className="button is-success">Edit</button>
                </div>
            </form>
        </div>
    )

}
 
export default EditService
