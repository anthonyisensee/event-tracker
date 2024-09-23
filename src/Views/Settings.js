import { useState } from "react"
import Modal from "../Shared/Bulma/Modal"
import { addEvent, addTracker, deleteDatabase } from "../IndexedDB/IndexedDB"
import { useNavigate, useSearchParams } from "react-router-dom"

const Settings = () => {

    const [params] = useSearchParams()
    const setting = params.get("setting")

    const [importDataModalActive, setImportDataModalActive] = useState(setting === "importdata")
    const [importData, setImportData] = useState()
    const [importDataErrorMessage, setImportDataErrorMessage] = useState()

    const [deleteAllDataModalActive, setDeleteAllDataModalActive] = useState()
    const [deleteAllDataFinalModalActive, setDeleteAllDataFinalModalActive] = useState()

    const [currentColorScheme, setCurrentColorScheme] = useState(
        localStorage.getItem("settingColorScheme")
        ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    )

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

    const handleColorSchemeChange = () => {

        const settingColorScheme = localStorage.getItem("settingColorScheme")
        const systemColorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        const newColorScheme = (settingColorScheme ?? systemColorScheme) === "dark" ? "light" : "dark"

        if (newColorScheme === systemColorScheme) {
            // Remove the user preference if it matches the system color scheme (essentially, reverting to the system color scheme)
            localStorage.removeItem("settingColorScheme")
        } else {
            // Add the user preference to local storage if it doesn't match the system color scheme
            localStorage.setItem("settingColorScheme", newColorScheme)
        }

        // Update the React State for color scheme so that the button emoji can be updated correctly
        setCurrentColorScheme(newColorScheme)

        // Add the css classes that dicate the color scheme to the html element
        const html = document.querySelector("html")
        html.classList.remove(`theme-${newColorScheme === "dark" ? "light" : "dark"}`)
        html.classList.add(`theme-${newColorScheme}`)

    }

    const handleDeleteAllData = (finalConfirmation = false) => {

        if (!finalConfirmation) {

            setDeleteAllDataModalActive(false)
            setDeleteAllDataFinalModalActive(true)

        } else {

            deleteDatabase()
                .then(() => {
                    setDeleteAllDataFinalModalActive(false)
                    navigate("/")
                })
                .catch(error => console.error(error))

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
                <div onClick={() => setDeleteAllDataModalActive(true)} className="button is-danger">Delete All Data</div>
                <Modal
                    isActive={deleteAllDataModalActive}
                    setIsActive={setDeleteAllDataModalActive}
                    onAction={() => handleDeleteAllData(false)}
                    action="delete"
                    headerTitle="Delete All Data"
                    bodyContent={
                        <p>Are you sure you want to delete all application data?</p>
                    }
                />
                <Modal
                    isActive={deleteAllDataFinalModalActive}
                    setIsActive={setDeleteAllDataFinalModalActive}
                    onAction={() => handleDeleteAllData(true)}
                    action="delete"
                    headerTitle="Delete All Data"
                    bodyContent={
                        <div>
                            <p><strong>WARNING: this action cannot be undone.</strong></p>
                            <p>Are you absolutely certain that you want to delete all application data?</p>
                        </div>
                    }
                />
            </div>
            <h2>Other</h2>
            <p>Handy settings to improve your life.</p>
            <div className="buttons">
                <button onClick={handleColorSchemeChange} className="button">
                    {currentColorScheme === "dark" ? "🌙" : "☀️"} Color Scheme
                </button>
            </div>
        </div>
    )
}

export default Settings
