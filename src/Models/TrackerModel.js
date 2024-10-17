export default class TrackerModel {

    constructor() {

        this.properties = {
            name: {
                label: "Name",
                type: "text"
            },
            targets: {
                label: "Targets",
                type: "select",
                options: [
                    { label: "Future events, then past events", value: 0},
                    { label: "Only past events", value: 1},
                    { label: "Past events, then future events", value: 2},
                    { label: "Only future events", value: 3},
                ],
                defaultOptionIndex: 0
            }
        }

    }

    getTrackerTargetsOptionLabel(trackerTargetsValue){

        const matchingValues = this.properties.targets.options.filter(option => option.value === parseInt(trackerTargetsValue))

        if (matchingValues.length === 0) {
            console.error("No matching values found for trackerTargetsValue.")
        } else {
            return matchingValues[0].label
        }
    
    }

}
