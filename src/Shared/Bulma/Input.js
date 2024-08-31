const Input = ({ label, type, defaultValue, onChange }) => {

    if (!label) {
        throw new Error("A required label was not provided to an Input component.")
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <input className="input" type={type ? type : "text"} defaultValue={defaultValue} onChange={onChange} />
            </div>
        </div>
    )

}
 
export default Input