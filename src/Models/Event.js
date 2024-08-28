export class Event {

    constructor(event) {

        this.id = event.id ?? null
        this.trackerId = event.trackerId ?? null
        this.date = event.date ?? null
        this.description = event.description ?? null

    }

}
