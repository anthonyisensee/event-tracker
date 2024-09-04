const Input = ({ label, type, defaultValue, onChange, required, step }) => {

    if (!label) {
        throw new Error("A required label was not provided to an Input component.")
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <input
                    className="input"
                    type={type ? type : "text"}
                    step={step ? step : ""}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    required={ required ? "required" : "" }
                />
            </div>
        </div>
    )

}
 
export default Input