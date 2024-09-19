import { useState } from "react"
import Modal from "../Shared/Bulma/Modal"
import { addEvent, addTracker } from "../IndexedDB/IndexedDB"
import { useNavigate, useSearchParams } from "react-router-dom"

const Settings = () => {

    const [params] = useSearchParams()
    const setting = params.get("setting")

    const [importDataModalActive, setImportDataModalActive] = useState(setting === "importdata")
    const [importData, setImportData] = useState()
    const [importDataErrorMessage, setImportDataErrorMessage] = useState()

    const navigate = useNavigate()

    // Parse, validate, and store imported data
    const handleImportData = () => {

        let data = undefined
        let errored = false

        // Attempt to parse the importData as JSON
        try {
            data = JSON.parse(importData)
        } catch (error) {
            errored = true
            setImportDataErrorMessage("The data you provided failed to parse. Please ensure that it is properly formatted JSON.")
        }

        if (!errored) {
            
            // Make sure the trackers exist
            const trackersExist = data.trackers?.length > 0
            
            if (!trackersExist) {
                errored = true
                setImportDataErrorMessage("The data you provided does not contain any trackers.")
            }

        }

        if (!errored) {

            const promises = []

            // Add every tracker
            data.trackers.forEach(tracker => {

                const promise = addTracker(tracker)
                    .then(trackerId => {

                        // Add each event from the tracker
                        tracker.events.forEach(event => {

                            addEvent({ ...event, trackerId })
                                .catch(() => {
                                    errored = true
                                    setImportDataErrorMessage("Error occurred while parsing event.")
                                })

                        })

                    })
                    .catch(() => {
                        errored = true
                        setImportDataErrorMessage("Error occurred while parsing trackers.")
                    })

                promises.push(promise)

            })

            Promise.all(promises)
                .then(() => {

                    // If no errors were encountered at any point re-direct to the dashboard
                    !errored && navigate("/dashboard")

                })

        }

    }

    return (
        <div className="content">
            <h1>Settings</h1>
            <h2>Data</h2>
            <p>Manage your data here.</p>
            <div className="buttons">
                <button onClick={() => setImportDataModalActive(true)} className="button">Import Data</button>
                <Modal
                    isActive={importDataModalActive}
                    setIsActive={setImportDataModalActive}
                    onAction={() => handleImportData()}
                    action="import"
                    headerTitle="Import Data"
                    bodyContent={
                        <div className="content">
                            <div className="field">
                                <div className="control">
                                    <label className="label">Data to Import</label>
                                    <textarea 
                                        className="textarea"
                                        onChange={e => setImportData(e.target.value)}
                                    ></textarea>
                                    <p className="help is-danger">{importDataErrorMessage}</p>
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    )
}

export default Settings
