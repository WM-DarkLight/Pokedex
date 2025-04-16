// IndexedDB setup
let db: IDBDatabase

export const initDatabase = async () => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open("pokedex_db", 1)

    request.onerror = (event) => {
      console.error("IndexedDB error:", event)
      reject("Failed to open database")
    }

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result
      console.log("Database opened successfully")
      resolve()
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores
      if (!db.objectStoreNames.contains("pokemon")) {
        db.createObjectStore("pokemon", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("species")) {
        db.createObjectStore("species", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("evolution")) {
        db.createObjectStore("evolution", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("moves")) {
        db.createObjectStore("moves", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("abilities")) {
        db.createObjectStore("abilities", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("types")) {
        db.createObjectStore("types", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("favorites")) {
        db.createObjectStore("favorites", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("teams")) {
        db.createObjectStore("teams", { keyPath: "id" })
      }
    }
  })
}

// Database operations
export const dbOperations = {
  // Get item from store
  get: (storeName: string, key: string | number) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized")
        return
      }

      const transaction = db.transaction(storeName, "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },

  // Put item in store
  put: (storeName: string, item: any) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized")
        return
      }

      const transaction = db.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put(item)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },

  // Delete item from store
  delete: (storeName: string, key: string | number) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized")
        return
      }

      const transaction = db.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => {
        resolve(undefined)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },

  // Get all items from store
  getAll: (storeName: string) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized")
        return
      }

      const transaction = db.transaction(storeName, "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },

  // Clear store
  clear: (storeName: string) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized")
        return
      }

      const transaction = db.transaction(storeName, "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => {
        resolve(undefined)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  },
}
