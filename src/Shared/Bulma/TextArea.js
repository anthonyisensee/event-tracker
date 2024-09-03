const TextArea = ({ label, defaultValue, onChange }) => {

    if (!label) {
        throw new Error("A required label was not provided to a TextArea component.")
    }

    return (
        <div className="field">
            <label className="label">{label}</label>
            <div className="control">
                <textarea className="textarea" defaultValue={defaultValue} onChange={onChange}></textarea>
            </div>
        </div>
    )

}
 
export default TextArea