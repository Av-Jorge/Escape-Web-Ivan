// Basic IndexedDB wrapper using idb
// Database structure:
// - lessons store lesson metadata and items with schedule info

const dbPromise = idb.openDB('srs-db', 1, {
  upgrade(db) {
    const store = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
    store.createIndex('nextDate', 'nextDate');
  }
});

async function addLesson(lesson) {
  const db = await dbPromise;
  const tx = db.transaction('items', 'readwrite');
  const today = dayjs(lesson.date);
  for (const item of lesson.items) {
    await tx.store.add({
      lesson: lesson.topic,
      word: item.word,
      spanish: item.spanish,
      example: item.example,
      ipa: item.ipa,
      esp_pron: item.esp_pron,
      step: 0,
      nextDate: today.format('YYYY-MM-DD')
    });
  }
  await tx.done;
}

async function getDueItems(dateStr) {
  const db = await dbPromise;
  return db.getAllFromIndex('items', 'nextDate', dateStr);
}

async function updateItem(obj) {
  const db = await dbPromise;
  await db.put('items', obj);
}

async function getArchive() {
  const db = await dbPromise;
  return db.getAll('items');
}
