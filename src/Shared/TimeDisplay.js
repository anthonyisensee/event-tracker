import { useState, useEffect, useCallback } from "react"
import { timeBetweenNowAnd } from "../DateHelperFunctions"
import { getLastEventWithTrackerId, getNextEventWithTrackerId } from "../IndexedDB/IndexedDB"
import { Link } from "react-router-dom"
import TrackerModel from "../Models/TrackerModel"


const TimeDisplay = ({ tracker, timesContainerClassName, timesClassName, unitsClassName, descriptionClassName }) => {

    const [displayEvent, setDisplayEvent] = useState()
    
    const [timeBetweenObject, setTimeBetweenObject] = useState(timeBetweenNowAnd(null, tracker))

    const getAndSetDisplayEvent = useCallback((tracker) => {

        const trackerModel = new TrackerModel()
        const label = trackerModel.getTrackerTargetsOptionLabel(tracker.targets)
        
        if (label === "Only future events" || label === "Future events, then past events") {

            getNextEventWithTrackerId(tracker.id)
                .then(event => {

                    // Needs to happen whether or not a next event exists
                    setDisplayEvent(event)

                    // If the next event doesn't exist and the right targeting mode has been set search for a last event
                    if (!event && label === "Future events, then past events") {

                        getLastEventWithTrackerId(tracker.id)
                            .then(event => setDisplayEvent(event))                            
                            .catch(error => console.error(error))

                    }

                })
                .catch(error => console.error(error))
        
        } 
        else if (label === "Only past events" || label === "Past events, then future events") { 
                
            getLastEventWithTrackerId(tracker.id)
                .then(event => {

                    setDisplayEvent(event)

                    // If the last event doesn't exist and the right targeting mode has been set search for a next event
                    if (!event && label === "Past events, then future events") {

                        getNextEventWithTrackerId(tracker.id)
                            .then(event => setDisplayEvent(event))                            
                            .catch(error => console.error(error))

                    }

                })
                .catch(error => console.error(error))

        }

    }, [])

    useEffect(() => {

        if (tracker) {
            getAndSetDisplayEvent(tracker)
        }

    }, [tracker, getAndSetDisplayEvent])

    useEffect(() => {

        // Update time between object (this must happen regardless of a display event)
        setTimeBetweenObject(timeBetweenNowAnd(displayEvent, tracker))

        // If there is a display event
        if (displayEvent) {

            // Set an interval that updates the time between object every second
            const interval = setInterval(() => {
                setTimeBetweenObject(timeBetweenNowAnd(displayEvent, tracker))
            }, 1000)

            // Clean up the interval when the component unmounts
            return () => clearInterval(interval)

        }

    }, [tracker, displayEvent])

    const buildDescription = (displayEvent, timeBetweenObject, tracker) => {

        // If a relevant event exists we want to build our text based on the isFuture property of the timeBetweenObject.
        if (displayEvent) {

            if (timeBetweenObject.inFuture) {
                
                return (
                    <>until the <Link to={`/event?id=${displayEvent.id}`}>next event</Link>.</>
                )

            } else {

                const wordWithCorrectTense = timeBetweenObject.timeUnits[timeBetweenObject.timeUnits.length - 1].isPlural ? "have" : "has"

                return (
                    <>{wordWithCorrectTense} passed since the <Link to={`/event?id=${displayEvent.id}`}>last event</Link>.</>
                )

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
            {timeBetweenObject && <>
                <div className="has-text-centered is-flex is-justify-content-center">
                    {timeBetweenObject.timeUnits.map((time, index) => (
                        <div className={timesContainerClassName} key={index}>
                            <p className={timesClassName}>{time.number}</p>
                            <p className={unitsClassName}>{time.unit}</p>
                        </div>
                    ))}
                </div>
                <div className={`content has-text-centered ${descriptionClassName}`}>
                    <p>{buildDescription(displayEvent, timeBetweenObject, tracker)}</p>
                </div>
            </>}
        </div>
    )

}

export default TimeDisplay
