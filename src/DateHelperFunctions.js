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

/**
 * Returns an array of objects representing the time between two events.
 * 
 * @param {Object} event1 The first event object.
 * @param {Object} event2 The second event object or now if not provided.
 * // TODO: Add a @param {Boolean} onlyOneUnit If true, only the largest unit of time will be returned.
 * @returns {Object} An object containing the time units and whether the time between the two events is in the future.
 */
export function timeBetween(event1, event2 = null) {

    // If a null event was provided for event1 short circuit and return a result indicating no time has passed.
    if (event1 === null) {
        
        return {
            inFuture: undefined,
            timeUnits: [{ unit: "time", number: "🛇", isPlural: false }]
        }

    }

    const currentTime = getEventDate(event2) ?? new Date()  // If a second date wasn't provided use the current date and time.
    const latestTime = getEventDate(event1)
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
