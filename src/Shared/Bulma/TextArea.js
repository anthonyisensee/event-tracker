const TextArea = ({ label, value }) => {

    if (!label) {
        throw new Error("A required label was not provided to a TextArea component.")
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <textarea className="textarea">{value}</textarea>
            </div>
        </div>
    )

}
 
export default TextArea