const databaseName = 'event-tracker'
const databaseCurrentVersion = 3

function openDatabase() {


    return new Promise((resolve, reject) => {

        const request = window.indexedDB.open(databaseName, databaseCurrentVersion)

        // When database version increase this function will be run.
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

                    // Note that no break is included until the very end of all cases. This is so the upgrade process can perform multiple upgrade steps when needed.
                
                // eslint-disable-next-line
                case 1:

                    // Create a compound index on events over trackerId, date, and time to make finding a tracker's events at certain times performant
                    event.target.transaction
                        .objectStore('events')
                        .createIndex(
                            'trackerId_date_time', 
                            ['trackerId', 'date', 'time'], 
                            { unique: false }
                        )

                // eslint-disable-next-line
                case 2:

                    // This version of the database introduces the need for a "targets" property on all tracker objects. 
                    
                    // For clients that have created trackers in a prior version of the database we must add the default value for this property to all tracker objects.

                    getAllTrackers()
                        .then(trackers => {
        
                            trackers.forEach(tracker => {

                                if (!tracker.targets) {
                                    
                                    putTracker({
                                        ...tracker,
                                        targets: "Past events"
                                    })
                                        .catch(error => console.error(error))

                                }
        
                            })
        
                        })
                        .catch(error => console.error(error))
                    
                    break   // There should only ever be one break and it should be after all cases. 
                
                default:    // Appease the linter
                    
            }



        }

        // When opening the database works as expected resolve the promise and return the result
        request.onsuccess = (event) => {

            resolve(event.target.result)

        }

        // When opening the database doesn't work as expected reject the promise and return the error
        request.onerror = (event) => {

            reject(event.target.error)

        }

    })

}

export async function deleteDatabase() {

    const request = window.indexedDB.deleteDatabase(databaseName)

    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve()
        request.onerror = (event) => reject(event.target.error)

    })

}

export async function addTracker(tracker) {

    // Open the db and add the new tracker object
    const db = await openDatabase()
    const transaction = db.transaction('trackers', 'readwrite')
    const objectStore = transaction.objectStore('trackers')
    const request = objectStore.add(tracker)

    // Return a promise with either a resolution and the id of the tracker or a rejection and error message
    return new Promise((resolve, reject) => {

        request.onsuccess = (event) => resolve(event.target.result)
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

export async function getAllEvents() {

    const db = await openDatabase()
    const transaction = db.transaction('events', 'readonly')
    const objectStore = transaction.objectStore('events')
    const request = objectStore.getAll()

    // Return a promise with either a resolution and the data or a rejection and an error message
    return new Promise((resolve, reject) => {

        request.onsuccess = () => resolve(request.result)
        request.onerror = (errorEvent) => reject(errorEvent.target.error)

    })

}

export async function getLatestEventWithTrackerId(trackerId) {

    const db = await openDatabase()
    const transaction = db.transaction('events', 'readonly')
    const objectStore = transaction.objectStore('events')
    
    // Get a reference to the relevant compound index
    const index = objectStore.index('trackerId_date_time')

    // Specify the range of values we wish to parse
    const compoundKeyLowerBound = [trackerId]
    // TODO: Specify an upper bound of the current moment to prevent selecting a future event.
    const compoundKeyUpperBound = [trackerId, '\uffff', '\uffff']   // \uffff represents the largest unicode character and thus indicates to the cursor that the range it covers should include all possible values for date and time
    const keyRange = IDBKeyRange.bound(compoundKeyLowerBound, compoundKeyUpperBound)

    // Open a cursor that will iterate over the keyRange in previous order, thus returning the most recent events first
    const cursorRequest = index.openCursor(keyRange, 'prev')

    return new Promise((resolve, reject) => {

        cursorRequest.onsuccess = (event) => {

            const cursor = event.target.result

            if (cursor) {
                
                // If the cursor exists then a value exists in the keyRange. Resolve the promise with only the first value.
                resolve(cursor.value)

            } else {

                // If the cursor does not exist then no values exist in the keyRange. Resolve the promise with null to indicate the event does not exist.
                resolve(null)

            }

        }

        // If the cursor request fails make sure to reject the promise with the relevant error.
        cursorRequest.onerror = (errorEvent) => reject(errorEvent.target.error)

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
