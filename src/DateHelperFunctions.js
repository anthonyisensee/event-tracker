export function timeSinceLastEventArray(lastEventDate) {

    // If a null date was provided short circuit and return an array indicating infinite time.
    if (lastEventDate === null) {
        return [{ unit: "Time", number: "∞"}]
    }

    const currentTime = new Date()
    const latestTime = new Date(lastEventDate)

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

    let encounteredNonZero = false

    differenceUnits.forEach((unit, index) => {

        // Don't include leading zeroes or their units in the array
        encounteredNonZero = encounteredNonZero || differenceValues[index] !== 0

        if (encounteredNonZero) {

            const isPlural = differenceValues[index] !== 1

            arrayOfDifferences.push({
                unit: `${differenceUnits[index]}${isPlural ? "s" : ""}`,
                number: differenceValues[index]
            })

        }

    })

    return arrayOfDifferences

}


export function currentInputDate() {

    const date = new Date()
    const yyyy = String(date.getFullYear())
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDay()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`

}

export function currentInputTime() {

    const date = new Date()
    const hh = String(date.getHours()).padStart(2, "0")
    const mm = String(date.getMinutes()).padStart(2, "0")
    const ss = String(date.getSeconds()).padStart(2, "0")
    return `${hh}:${mm}:${ss}`

}