function openDatabase() {

    const databaseName = 'event-tracker'
    const databaseCurrentVersion = 1

    return new Promise((resolve, reject) => {

        const request = window.indexedDB.open(databaseName, databaseCurrentVersion)

        // When database version increase, run this function.
        request.onupgradeneeded = (event) => {

            const db = event.target.result

            switch(event.oldVersion) {

                // Database does not yet exist. Initialize the database.
                case 0:

                    // Create tracker objectStore
                    db.createObjectStore('trackers', { keyPath: 'id', autoIncrement: true })
                    
                    // Create event objectStore with index on trackerId
                    const eventObjectStore = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true })
                    eventObjectStore.createIndex('trackerId', 'trackerId', { unique: false })

            }

        }

        // When opening the database works as expected resolve the promise and return the result
        request.onsuccess = (event) => {

            resolve(event.target.result)

        }

        // When opening the database doesn't work reject the promise and return the error
        request.onerror = (event) => {

            reject(event.target.error)

        }

    })

}

export async function addTracker(tracker) {

    // Open the db and add the new tracker object
    const db = await openDatabase()
    const transaction = db.transaction('trackers', 'readwrite')
    const objectStore = transaction.objectStore('trackers')
    objectStore.add(tracker)

    // Return a promise with either a resolution or a rejection and error message
    return new Promise((resolve, reject) => {

        transaction.oncomplete = () => resolve()
        transaction.onerror = (event) => reject(event.target.error)

    })

}

export async function getTracker(trackerId) {

    const db = await openDatabase()
    const transaction = db.transaction('trackers', 'readonly')
    const objectStore = transaction.objectStore('trackers')
    const request = objectStore.get(trackerId)

    // Return a promise with either a resolution and the data or a rejection and error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (event) => reject(event.target.error)

    })

}

export async function putTracker(tracker) {

    const db = await openDatabase()
    const transaction = db.transaction('trackers', 'readwrite')
    const objectStore = transaction.objectStore('trackers')
    const request = objectStore.put(tracker)

    // Return a promise with either a resolution and the data or a rejection and error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (event) => reject(event.target.error)

    })

}

export async function removeTracker(trackerId) {

    // Open the db and remove the new tracker object
    const db = await openDatabase()
    const transaction = db.transaction('trackers', 'readwrite')
    const objectStore = transaction.objectStore('trackers')
    objectStore.delete(trackerId)

    // Return a promise with either a resolution or a rejection and error message
    return new Promise((resolve, reject) => {

        transaction.oncomplete = () => resolve()
        transaction.onerror = (event) => reject(event.target.error)

    })

}

export async function getAllTrackers() {

    const db = await openDatabase()
    const transaction = db.transaction('trackers', 'readonly')
    const objectStore = transaction.objectStore('trackers')
    const request = objectStore.getAll()

    // Return a promise with either a resolution and the data or a rejection and error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (event) => reject(event.target.error)

    })

}

export async function addEvent(event) {

    // Open the db and add the new tracker object
    const db = await openDatabase()
    const transaction = db.transaction('events', 'readwrite')
    const objectStore = transaction.objectStore('events')
    objectStore.add(event)

    // Return a promise with either a resolution or a rejection and error message
    return new Promise((resolve, reject) => {

        transaction.oncomplete = () => resolve()
        transaction.onerror = (event) => reject(event.target.error)

    })

}
