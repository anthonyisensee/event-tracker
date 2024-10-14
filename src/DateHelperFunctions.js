import TrackerModel from "./Models/TrackerModel"

export function timeSinceDateArray(event) {

    // If a null date was provided short circuit and return an array indicating infinite time.
    if (event === null) {
        return [{ unit: "time", number: "Ø", isPlural: false }]
    }

    const currentTime = new Date()
    const latestTime = new Date(event)

    const milliseconds = (currentTime - latestTime)
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    const differenceUnits = ["year", "month", "day", "hour", "minute", "second"]
    const differenceValues = [years, months % 12, days % 30, hours % 24, minutes % 60, seconds % 60]

    const arrayOfDifferences = []

    let encounteredNonZeroUnit = false

    differenceUnits.forEach((unit, index) => {

        const thisUnitZero = differenceValues[index] !== 0
        encounteredNonZeroUnit = encounteredNonZeroUnit || thisUnitZero
        const isLastUnit = differenceValues.length === index + 1
        
        // Don't include leading zeroes or their units in the array (except for the last unit)
        if (encounteredNonZeroUnit || isLastUnit) {

            const isPlural = differenceValues[index] !== 1

            arrayOfDifferences.push({
                unit: `${differenceUnits[index]}${isPlural ? "s" : ""}`,
                number: differenceValues[index],
                isPlural: isPlural
            })

        }

    })

    return arrayOfDifferences

}

// TODO: Improve accuracy on year and month difference.
console.log(timeBetweenDates(new Date("2024-03-01 11:11:11"),new Date("2024-04-01 11:11:11")))
export function timeBetweenDates(firstDate, secondDate = new Date(), onlyReturnLargestUnit = false, returnNonLeadingZeroes = false) {

    const units = {
        "year": {
            milliseconds: 29030400000,  // One year is 12 months of four weeks each
            mod: undefined
        },
        "month": { 
            milliseconds: 2419200000,   // One month is four weeks
            mod: 29030400000
        },
        "week": {
            milliseconds: 604800000,
            mod: 2419200000
        },
        "day": { 
            milliseconds: 86400000,
            mod: 604800000
        },
        "hour": { 
            milliseconds: 3600000,
            mod: 86400000
        },
        "minute": { 
            milliseconds: 60000,
            mod: 3600000
        },
        "second": { 
            milliseconds: 1000,
            mod: 60000
        }
    }

    let totalMilliseconds = secondDate - firstDate

    const inPast = totalMilliseconds / 1000 >= 1
    const inPresent = -999 < totalMilliseconds && totalMilliseconds < 999
    const inFuture = !inPast && !inPresent
    
    const returnObject = { inPast, inPresent, inFuture }

    if (inPresent) {
        return { 
            ...returnObject, 
            times: [{ number: "Right Now", unit: "" }]
        }
    }
    
    totalMilliseconds = Math.abs(totalMilliseconds)

    const times = []

    let encounteredNonZeroUnit = false

    for (const [key, value] of Object.entries(units)) {

        let number = 0
        
        if (value.mod) {

            const moduloMilliseconds = value.mod
            number = Math.floor((totalMilliseconds % moduloMilliseconds) / value.milliseconds)
        
        } else {

            number = Math.floor(totalMilliseconds / value.milliseconds)

        }

        const unit = key + (number === 1 ? "" : "s")

        if (number > 0 || (returnNonLeadingZeroes && encounteredNonZeroUnit)) {

            encounteredNonZeroUnit = true

            times.push({ number, unit })

            if (onlyReturnLargestUnit) {
                break
            }

        }

    }

    return { ...returnObject, times }

}

/**
 * Returns an object with properties that contain information needed for time displays.
 * 
 * @param {Object} event The first event object.
 * // TODO: Add a @param {Boolean} onlyOneUnit If true, only the largest unit of time will be returned.
 * @returns {Object} An object containing the time units and whether the time between the two events is in the future.
 */
export function timeBetweenNowAnd(event, tracker) {
    
    if (!event) {

        const defaultObject = {
            inFuture: true,
            timeUnits: [{ unit: "time", number: "REPLACE", isPlural: false }]
        }

        const trackerModel = new TrackerModel()
        const label = trackerModel.getTrackerTargetsOptionLabel(tracker.targets)

        
        if (label === "Only future events" || label === "Future events, then past events") {
            defaultObject.timeUnits[0].number = "∞"
        }
        else if (label === "Only past events" || label === "Past events, then future events") {
            defaultObject.timeUnits[0].number = "🛇"
        }

        return defaultObject

    }

    const currentTime = new Date()
    const latestTime = getEventDate(event)
    const difference = currentTime - latestTime
    const inFuture = difference < 0
    const milliseconds = Math.abs(difference)
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    const differenceUnits = ["year", "month", "day", "hour", "minute", "second"]
    const differenceValues = [years, months % 12, days % 30, hours % 24, minutes % 60, seconds % 60]

    const timeUnits = []

    let encounteredNonZeroUnit = false

    differenceUnits.forEach((unit, index) => {

        const thisUnitZero = differenceValues[index] !== 0
        encounteredNonZeroUnit = encounteredNonZeroUnit || thisUnitZero
        const isLastUnit = differenceValues.length === index + 1

        // Don't include leading zeroes or their units in the array (except for the last unit)
        if (encounteredNonZeroUnit || isLastUnit) {

            const isPlural = differenceValues[index] !== 1

            timeUnits.push({
                unit: `${differenceUnits[index]}${isPlural ? "s" : ""}`,
                number: differenceValues[index],
                isPlural: isPlural
            })

        }

    })

    return { inFuture, timeUnits }

}

export function currentInputDate() {

    const date = new Date()
    const yyyy = String(date.getFullYear())
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`

}

export function currentInputTime() {

    const date = new Date()
    const hh = String(date.getHours()).padStart(2, "0")
    const mm = String(date.getMinutes()).padStart(2, "0")
    const ss = String(date.getSeconds()).padStart(2, "0")
    return `${hh}:${mm}:${ss}`

}

export function getEventDate(event) {

    return event && event.date && event.time ? new Date(`${event.date} ${event.time}`) : null

}
