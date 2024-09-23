import { useState } from "react"
import Modal from "../Shared/Bulma/Modal"
import { addEvent, addTracker, deleteDatabase, getAllEventsWithTrackerId, getAllTrackers } from "../IndexedDB/IndexedDB"
import { useNavigate, useSearchParams } from "react-router-dom"

const Settings = () => {

    const [params] = useSearchParams()
    const setting = params.get("setting")

    // Import data setting
    const [importDataModalActive, setImportDataModalActive] = useState(setting === "importdata")
    const [importData, setImportData] = useState()
    const [importDataErrorMessage, setImportDataErrorMessage] = useState()
    
    // Export data setting
    const [exportDataModalActive, setExportDataModalActive] = useState(setting === "exportdata")
    const [exportData, setExportData] = useState()
    const [exportDataSuccessMessage, setExportDataSuccessMessage] = useState()
    
    // Delete all data setting
    const [deleteAllDataModalActive, setDeleteAllDataModalActive] = useState()
    const [deleteAllDataFinalModalActive, setDeleteAllDataFinalModalActive] = useState()

    // Color scheme setting
    const [currentColorScheme, setCurrentColorScheme] = useState(
        localStorage.getItem("settingColorScheme")
        ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    )

    const navigate = useNavigate()

    const handleExportDataModalActive = (isActive) => {
        
        if (!isActive) {
            setExportDataSuccessMessage(undefined)
            setExportData(undefined)
        }

        setExportDataModalActive(isActive)

    }

    const handleOpenExportDataModal = () => {

        handleExportDataModalActive(true)

        let data = {
            trackers: []
        }
        
        getAllTrackers()
            .then(trackers => {

                const eventPromises = trackers.map(tracker => getAllEventsWithTrackerId(tracker.id))

                Promise.all(eventPromises)
                    .then(eventsByTracker => {

                        eventsByTracker.forEach((event, index) => {

                            // Assemble the tracker object
                            let trackerObject = {
                                ...trackers[index],
                                events: eventsByTracker[index]
                            }

                            // Remove ids
                            delete trackerObject.id
                            trackerObject.events.forEach(event => {
                                delete event.id
                                delete event.trackerId
                            })

                            // Add the data to the array
                            data.trackers.push(trackerObject)

                        })
        
                    })
                    .then(() => {

                        setExportData(JSON.stringify(data))
                        
                    })
                    .catch(error => console.error(error))

            })
            .catch(error => console.error(error))

    }

    const handleCopyExportedData = () => {

        async function copyToClipboard(text) {

            const type = "text/plain"
            const blob = new Blob([text], { type })
            const data = [new ClipboardItem({ [type]: blob })]

            await navigator.clipboard.write(data)
            
        }

        copyToClipboard(exportData)
            .then(() => {
                setExportDataSuccessMessage("Data copied to clipboard.")
            })

    }

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

    return (
        <div className="content">
            <h1>Settings</h1>
            <h2>Data</h2>
            <p>Manage your data here.</p>
            <div className="buttons">
                <button onClick={handleOpenExportDataModal} className="button">Export Data</button>
                <Modal
                    isActive={exportDataModalActive}
                    setIsActive={handleExportDataModalActive}
                    headerTitle="Export Data"
                    hasFooter={false}
                    bodyContent={
                        <div className="content">
                            <div className="field">
                                <div className="control">
                                    <label className="label">Exported Data</label>
                                    <textarea
                                        className="textarea"
                                        onChange={e => setExportData(e.target.value)}
                                        readOnly
                                        value={exportData}
                                        placeholder="Exporting data..."
                                    ></textarea>
                                    {exportDataSuccessMessage && 
                                        <p className="help">{exportDataSuccessMessage}</p>
                                    }
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button
                                        onClick={handleCopyExportedData}
                                        className="button"
                                        disabled={exportData ?? false ? false : true}
                                    >Copy</button>
                                </div>
                            </div>
                        </div>
                    }
                />
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
