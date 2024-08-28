const TextArea = ({ label, value, onChange }) => {

    if (!label) {
        throw new Error("A required label was not provided to a TextArea component.")
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <textarea className="textarea" onChange={onChange}>{value}</textarea>
            </div>
        </div>
    )

}
 
export default TextArea