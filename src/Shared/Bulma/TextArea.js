const TextArea = ({ label, defaultValue, onChange, minLength, maxLength }) => {

    if (!label) {
        throw new Error("A required label was not provided to a TextArea component.")
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <textarea
                    className="textarea"
                    {...(defaultValue && { defaultValue })}
                    {...(onChange && { onChange })}
                    {...(minLength && { minLength })}
                    {...(maxLength && { maxLength })}
                >
                </textarea>
            </div>
        </div>
    )

}
 
export default TextArea