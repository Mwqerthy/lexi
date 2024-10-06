const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// Define the database name and version
const dbName = "fileStorageDB";
const dbVersion = 1;
let db;

/**
 * Initialize the IndexedDB database
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            if (!db.objectStoreNames.contains("files")) {
                const fileStore = db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("IndexedDB initialized successfully.");
            resolve(); // Resolve the promise
        };

        request.onerror = (event) => {
            console.error("Error initializing IndexedDB:", event.target.errorCode);
            reject(event.target.errorCode); // Reject the promise
        };
    });
}

/**
 * Store a file (Blob) into IndexedDB
 */
export function storeFileInIndexedDB(file) {
    const transaction = db.transaction(["files"], "readwrite");
    const fileStore = transaction.objectStore("files");

    // Get all files to check if the current file already exists
    const request = fileStore.getAll();

    request.onsuccess = (event) => {
        const files = event.target.result;
        const existingFile = files.find(f => f.fileName === file.name); // Check if the file exists

        if (existingFile) {
            // File exists, update its lastModified date and store it again
            existingFile.lastModified = new Date();
            const updateRequest = fileStore.put(existingFile); // `put` is used to update the file

            updateRequest.onsuccess = () => {
                console.log(`File ${file.name} updated with a new lastModified date.`);
            };

            updateRequest.onerror = (event) => {
                console.error("Error updating file:", event.target.errorCode);
            };
        } else {
            // File does not exist, add it as a new file
            const fileData = {
                fileName: file.name,
                fileBlob: file,
                lastModified: new Date()
            };

            const addRequest = fileStore.add(fileData);

            addRequest.onsuccess = () => {
                console.log(`File ${file.name} stored successfully.`);
            };

            addRequest.onerror = (event) => {
                console.error("Error storing file:", event.target.errorCode);
            };
        }
    };

    request.onerror = (event) => {
        console.error("Error fetching files:", event.target.errorCode);
    };
}

/**
 * Fetch all files from IndexedDB
 */
export function fetchAllFiles() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["files"], "readonly");
        const fileStore = transaction.objectStore("files");

        const request = fileStore.getAll();  // Fetches all files

        request.onsuccess = (event) => {
            const files = event.target.result;
            resolve(files);
        };

        request.onerror = (event) => {
            console.error("Error fetching files:", event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

/**
 * Delete a file by its position in the file list (index)
 * @param {number} fileIndex - The index of the file to delete in the file list
 */
export function deleteFileByIndex(fileIndex) {
    fetchAllFiles().then((files) => {
        if (fileIndex >= 0 && fileIndex < files.length) {
            const fileId = files[fileIndex].id;  // Get the `id` of the file at the specified index
            const transaction = db.transaction(["files"], "readwrite");
            const fileStore = transaction.objectStore("files");

            const request = fileStore.delete(fileId);  // Delete the file by its `id`

            request.onsuccess = () => {
                console.log(`File at index ${fileIndex} (id: ${fileId}) deleted successfully.`);
            };

            request.onerror = (event) => {
                console.error("Error deleting file:", event.target.errorCode);
            };
        } else {
            console.error("File index out of bounds.");
        }
    }).catch((error) => {
        console.error("Error fetching files for deletion:", error);
    });
}

/**
 * Clear all files from IndexedDB
 */
export function clearAllFiles() {
    const transaction = db.transaction(["files"], "readwrite");
    const fileStore = transaction.objectStore("files");
    const request = fileStore.clear();

    request.onsuccess = () => {
        console.log("All files cleared.");
    };

    request.onerror = (event) => {
        console.error("Error clearing files:", event.target.errorCode);
    };
}
