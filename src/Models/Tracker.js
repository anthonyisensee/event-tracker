export default class Tracker {

    constructor() {

        this.properties = {
            name: {
                type: "text"
            },
            targets: {
                type: "select",
                options: [
                    { label: "Future events, then past events", value: "futureThenPast"},
                    { label: "Only past events", value: "past"},
                    { label: "Past events, then future events", value: "pastThenFuture"},
                    { label: "Only future events", value: "future"},
                ],
                defaultOptionIndex: 0
            }
        }

    }

}
