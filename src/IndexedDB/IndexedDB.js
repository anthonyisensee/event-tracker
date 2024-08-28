export default class IndexedDB {

    constructor() {

        this.currentVersion = 1
        this.databaseName = "event-tracker"

        this.db = window.indexedDB.open(this.databaseName, this.currentVersion)

        console.log("opened db")

        this.db.onerror = (event) => {

            const message = `IndexedDB error: ${event.target.error?.message}`

            console.error(message)

            throw new Error(message)

        }

        this.db.onupgradeneeded = (event) => {

            console.log("Beginning IDB onupgrade event.")

            const db = event.target.result

            switch(event.oldVersion) {

                case 0:

                    // Database does not yet exist. Initialize database.

                    db.createObjectStore("trackers", { keyPath: "id", autoIncrement: true })
                    
                    const eventObjectStore = db.createObjectStore("events", { keyPath: "id", autoIncrement: true })
                    eventObjectStore.index("trackerId")

                default:

            }

            console.log("Completing IDB onupgrade event.")

        }

        this.db.onsuccess = (event) => {

            console.log("Beginning IDB onsuccess event.")

            const db = event.target.result

            console.log("Completing IDB onsuccess event.")

        }
        
    }

    // get(storeName, id) {

    //     const objectStore = this.db
    //         .transaction(storeName, "readonly")
    //         .objectStore(storeName)

    //     if (id) {

    //         objectStore.get(id)

    //     } else {

    //         objectStore.getAll()

    //     }

    // }

}
