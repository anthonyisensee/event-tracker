export class Service {

    constructor(service) {

        this.name = service.name ?? null
        this.events = service.events ?? []

    }

    get timeSinceLastEventArray() {

        const currentTime = new Date()
        const latestTime = new Date(this.events[this.events.length - 1].date)

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

                arrayOfDifferences.push({
                    unit: differenceUnits[index],
                    number: differenceValues[index]
                })

            }

        })

        return arrayOfDifferences

    }

    get timeSinceLastEventSentence() {

        let output_string = "∞"

        if (this.events.length > 0) {

            const current_time = new Date()
            const latest_time = new Date(this.events[this.events.length - 1].date)

            const milliseconds = (current_time - latest_time)
            const seconds = Math.floor(milliseconds / 1000)
            const minutes = Math.floor(seconds / 60)
            const hours = Math.floor(minutes / 60)
            const days = Math.floor(hours / 24)
            // const months = Math.floor(days / 30)
            // const years = Math.floor(days / 365)

            const difference_unit_labels = ["day", "hour", "minute", "second"]
            const difference_values = [days, hours % 24, minutes % 60, seconds % 60]

            let position_first_value_not_zero = difference_values.length - 1    // Sets a default so "0 seconds" will appear

            for (let i = 0; i < difference_values.length; i++) {

                if (difference_values[i] !== 0) {

                    position_first_value_not_zero = i

                    break

                }

            }

            output_string = ""

            for (let i = position_first_value_not_zero; i < difference_values.length; i++) {

                let add_to_end_of_string = ", "    // Separator for most cases

                const displaying_two_or_more_units = position_first_value_not_zero <= difference_values.length - 2
                const is_and_concatenation = i === difference_values.length - 2
                const displaying_only_two_units = position_first_value_not_zero === difference_values.length - 2

                if (displaying_two_or_more_units && is_and_concatenation) {

                    if (displaying_only_two_units) {

                        add_to_end_of_string = " and "

                    } else {

                        add_to_end_of_string = add_to_end_of_string + " and "

                    }

                }

                const is_final_concatenation = i === difference_values.length - 1

                if (is_final_concatenation) {

                    add_to_end_of_string = ""

                }

                const this_unit_plural = difference_values[i] !== 1

                if (this_unit_plural) {

                    add_to_end_of_string = "s" + add_to_end_of_string

                }

                output_string += `${difference_values[i]} ${difference_unit_labels[i]}` + add_to_end_of_string

            }

        }

        return output_string

    }

}
