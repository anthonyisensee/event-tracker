import { useState, useEffect, useCallback } from "react"
import { getEventDate, timeBetweenDates } from "../DateHelperFunctions"
import { getLastEventWithTrackerId, getNextEventWithTrackerId } from "../IndexedDB/IndexedDB"
import { Link } from "react-router-dom"
import TrackerModel from "../Models/TrackerModel"


const TimeDisplay = ({ tracker, timesContainerClassName, timesClassName, unitsClassName, descriptionClassName }) => {

    const [displayEvent, setDisplayEvent] = useState()
    const [timeBetween, setTimeBetween] = useState(timeBetweenDates(null, null, null, true))

    const setRelevantDisplayEvent = useCallback((tracker) => {

        const trackerModel = new TrackerModel()
        const label = trackerModel.getTrackerTargetsOptionLabel(tracker.targets)

        let initialEventRetrievalFunction
        let backupEventRetrievalFunction

        if (["Only future events", "Future events, then past events"].includes(label)) {

            initialEventRetrievalFunction = getNextEventWithTrackerId

            if (label === "Future events, then past events") {

                backupEventRetrievalFunction = getLastEventWithTrackerId

            }

        } 
        // else if (["Only future events", "Future events, then past events"].contains(label)) AND any other result for label
        else {    
            
            initialEventRetrievalFunction = getLastEventWithTrackerId

            if (label === "Past events, then future events") {

                backupEventRetrievalFunction = getNextEventWithTrackerId

            }

        }

        initialEventRetrievalFunction(tracker.id)
            .then(event => {

                setDisplayEvent(event)

                if (!event && backupEventRetrievalFunction) {
                    
                    backupEventRetrievalFunction(tracker.id)
                        .then(event => event && setDisplayEvent(event))
                        .catch(error => console.error(error))

                }

            })
            .catch(error => console.error(error))

    }, [])

    useEffect(() => {

        console.log("tracker changed to", tracker)

        if (tracker) {
            setRelevantDisplayEvent(tracker)
        }

    }, [tracker, setRelevantDisplayEvent])

    useEffect(() => {

        // Update time between object (this must happen regardless of a display event)
        setTimeBetween(timeBetweenDates(getEventDate(displayEvent), null, null, true))

        // If there is a display event
        if (displayEvent) {

            // Set an interval that updates the time between object every second
            const interval = setInterval(() => {
                setTimeBetween(timeBetweenDates(getEventDate(displayEvent), null, null, true))
            }, 1000)

            // Clean up the interval when the component unmounts
            return () => clearInterval(interval)

        }

    }, [displayEvent])

    const buildDescription = (displayEvent, timeBetween, tracker) => {

        // If a relevant event exists we want to build our text based on the isFuture property of the timeBetween.
        if (displayEvent) {

            if (timeBetween.inFuture) {
                
                return <>until the <Link to={`/event?id=${displayEvent.id}`}>next event</Link>.</>

            } else if (timeBetween.inPresent) {

                return <>The <Link to={`/event?id=${displayEvent.id}`}>current event</Link> is now.</>

            } else {    // timeBetween.inPast serves as the default

                const wordWithCorrectTense = timeBetween.times[timeBetween.times.length - 1].isPlural ? "have" : "has"
                return <>{wordWithCorrectTense} passed since the <Link to={`/event?id=${displayEvent.id}`}>last event</Link>.</>

            }

        } 
        // If a relevant event does not exist, we want to build text based on the tracker's default targeting.
        else {

            const trackerModel = new TrackerModel()
            const label = trackerModel.getTrackerTargetsOptionLabel(tracker.targets)

            if (label === "Only past events" || label === "Past events, then future events") {

                return `has passed since the last event.`

            } 
            else if (label === "Only future events" || label === "Future events, then past events") {

                return `until the next event.`

            }
            else {

                console.error("TimeDisplay does not account for all possible options of tracker property targets.")

            }

        }

        // If nothing has been returned at this point something has gone wrong. Return a default.
        return "...something went wrong."

    }

    timesContainerClassName = timesContainerClassName ?? "ml-1 mr-1 mb-3"
    timesClassName = timesClassName ?? "is-size-4"
    unitsClassName = unitsClassName ?? "is-size-7"
    descriptionClassName = descriptionClassName ?? "is-size-6 mb-4"

    return (
        <div>
            {timeBetween && <>
                <div className="has-text-centered is-flex is-justify-content-center">
                    {timeBetween.times.map((time, index) => (
                        <div className={timesContainerClassName} key={index}>
                            <p className={timesClassName}>{time.number}</p>
                            <p className={unitsClassName}>{time.unit}</p>
                        </div>
                    ))}
                </div>
                <div className={`content has-text-centered ${descriptionClassName}`}>
                    <p>{buildDescription(displayEvent, timeBetween, tracker)}</p>
                </div>
            </>}
        </div>
    )

}

export default TimeDisplay
