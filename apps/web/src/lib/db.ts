import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface GameEvent {
  id: string;
  userId: string;
  gameId: string;
  sessionId: string;
  timestamp: number;
  type: string;
  payload: Record<string, any>;
  synced: boolean;
}

interface MindLabDB extends DBSchema {
  events: {
    key: string;
    value: GameEvent;
    indexes: { 'by-synced': boolean };
  };
}

let db: IDBPDatabase<MindLabDB>;

export async function initDB() {
  if (typeof window === 'undefined') return;
  
  db = await openDB<MindLabDB>('mindlab-play', 1, {
    upgrade(database) {
      const eventStore = database.createObjectStore('events', { keyPath: 'id' });
      eventStore.createIndex('by-synced', 'synced');
    },
  });
}

export async function saveEvent(event: GameEvent) {
  if (!db) await initDB();
  await db.put('events', event);
}

export async function getUnsyncedEvents(): Promise<GameEvent[]> {
  if (!db) await initDB();
  return db.getAllFromIndex('events', 'by-synced', false);
}

export async function markEventsSynced(ids: string[]) {
  if (!db) await initDB();
  const tx = db.transaction('events', 'readwrite');
  for (const id of ids) {
    const event = await tx.store.get(id);
    if (event) {
      event.synced = true;
      await tx.store.put(event);
    }
  }
  await tx.done;
}
