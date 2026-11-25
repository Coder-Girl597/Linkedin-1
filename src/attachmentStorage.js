const DATABASE_NAME = 'connectly-media';
const STORE_NAME = 'attachments';
const DATABASE_VERSION = 1;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open attachment storage.'));
  });
}

async function runTransaction(mode, operation) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    let request;
    let result;

    try {
      request = operation(transaction.objectStore(STORE_NAME));
    } catch (error) {
      database.close();
      reject(error);
      return;
    }

    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error || new Error('Could not access attachment storage.'));
    transaction.oncomplete = () => {
      database.close();
      resolve(result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Attachment storage transaction failed.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Attachment storage transaction was aborted.'));
    };
  });
}

export function saveAttachment(id, file) {
  return runTransaction('readwrite', (store) => store.put(file, id));
}

export function getAttachment(id) {
  return runTransaction('readonly', (store) => store.get(id));
}

export function deleteAttachment(id) {
  return runTransaction('readwrite', (store) => store.delete(id));
}
