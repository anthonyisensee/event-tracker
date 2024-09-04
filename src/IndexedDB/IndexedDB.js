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

                    break   // There should only ever be one break and it should be after all the numbered cases.
                
                default:    // Appease the linter
                    
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

    // Return a promise with either a resolution and the data or a rejection and an error message
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

    // Return a promise with either a resolution and the data or a rejection and an error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (event) => reject(event.target.error)

    })

}

export async function deleteTracker(trackerId) {

    // Open the db and specify the object stores that will be modified
    const db = await openDatabase()
    const transaction = db.transaction(['trackers', 'events'], 'readwrite')

    // Remove the tracker object
    const trackerObjectStore = transaction.objectStore('trackers')
    trackerObjectStore.delete(trackerId)

    // Remove any event objects associated with the tracker
    const eventObjectStore = transaction.objectStore('events')
    const eventTrackerIndex = eventObjectStore.index('trackerId')
    const trackerKeyRange = IDBKeyRange.only(trackerId)
    const eventTrackerIdCursor = eventTrackerIndex.openKeyCursor(trackerKeyRange)
    
    eventTrackerIdCursor.onsuccess = (event) => {

        const cursor = event.target.result
        
        if (cursor) {

            eventObjectStore.delete(cursor.primaryKey)
            cursor.continue()

        }

    }

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

    // Return a promise with either a resolution and the data or a rejection and an error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (event) => reject(event.target.error)

    })

}

export async function addEvent(event) {

    // Open the db and add the new event object
    const db = await openDatabase()
    const transaction = db.transaction('events', 'readwrite')
    const objectStore = transaction.objectStore('events')
    objectStore.add(event)

    // Return a promise with either a resolution or a rejection and error message
    return new Promise((resolve, reject) => {

        transaction.oncomplete = () => resolve()
        transaction.onerror = (errorEvent) => reject(errorEvent.target.error)

    })

}

export async function getEvent(eventId) {

    const db = await openDatabase()
    const transaction = db.transaction('events', 'readonly')
    const objectStore = transaction.objectStore('events')
    const request = objectStore.get(eventId)

    // Return a promise with either a resolution and the data or a rejection and an error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (errorEvent) => reject(errorEvent.target.error)

    })

}

export async function putEvent(event) {

    const db = await openDatabase()
    const transaction = db.transaction('events', 'readwrite')
    const objectStore = transaction.objectStore('events')
    const request = objectStore.put(event)

    // Return a promise with either a resolution and the data or a rejection and an error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (errorEvent) => reject(errorEvent.target.error)

    })

}

export async function deleteEvent(eventId) {

    // Open the db and remove the new event object
    const db = await openDatabase()
    const transaction = db.transaction('events', 'readwrite')
    const objectStore = transaction.objectStore('events')
    objectStore.delete(eventId)

    // Return a promise with either a resolution or a rejection and error message
    return new Promise((resolve, reject) => {

        transaction.oncomplete = () => resolve()
        transaction.onerror = (errorEvent) => reject(errorEvent.target.error)

    })

}

// export async function getAllEvents() {

//     const db = await openDatabase()
//     const transaction = db.transaction('events', 'readonly')
//     const objectStore = transaction.objectStore('events')
//     const request = objectStore.getAll()

//     // Return a promise with either a resolution and the data or a rejection and an error message
//     return new Promise((resolve, reject) => {

//         request.onsuccess = () => resolve(request.result)
//         request.onerror = (errorEvent) => reject(errorEvent.target.error)

//     })

// }

export async function getAllEventsWithTrackerId(trackerId) {

    const db = await openDatabase()
    const transaction = db.transaction('events', 'readonly')
    const objectStore = transaction.objectStore('events')
    const index = objectStore.index('trackerId')
    const request = index.getAll(trackerId)

    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (errorEvent) => reject(errorEvent.target.error)

    })

}
