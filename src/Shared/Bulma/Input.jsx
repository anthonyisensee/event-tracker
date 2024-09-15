const Input = ({ label, type, defaultValue, onChange, required, step, min, max, minLength, maxLength }) => {

    if (!label) {
        throw new Error("A required label was not provided to an Input component.")
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <input
                    className="input"
                    type={type || "text"}
                    {...(step && { step })}
                    {...(defaultValue && { defaultValue })}
                    {...(onChange && { onChange })}
                    {...(required && { required: true })}
                    {...(min && { min })}
                    {...(max && { max })}
                    {...(minLength && { minLength })}
                    {...(maxLength && { maxLength })}
                />
            </div>
        </div>
    )

}
 
export default Input