function checkForIndexedDb() {
    if (!window.indexedDB) {
      console.log("Your browser doesn't support a stable version of IndexedDB.");
      return false;
    }
    return true;
}
  
function useIndexedDb(databaseName, method, object) {

    storeName = "addToDB";
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(databaseName, 1);
        let db,
        tx,
        store;

        request.onupgradeneeded = function(e) {
        const db = request.result;
        
        db.createObjectStore(storeName, { autoIncrement: true });
        };

        request.onerror = function(e) {
        console.log("There was an error");
        };

        request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction(storeName, "readwrite");
        store = tx.objectStore(storeName);

        db.onerror = function(e) {
            console.log("error");
        };
        if (method === "put") {
            store.put(object);
        } else if (method === "get") {
            const all = store.getAll();
            all.onsuccess = function() {
            resolve(all.result);
            };
        } 
        tx.oncomplete = function() {
            db.close();
        };
        };
    });
}

function saveRecord(item) {
    useIndexedDb("budget", "put", {item});
}

function loadPage() {
    if (checkForIndexedDb()) {
        useIndexedDb("budget", "get");
    }
}

loadPage();