"use client";

import { useEffect, useState } from 'react';
import { getUnsyncedEvents, markEventsSynced } from '@/lib/db';

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncEvents = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    try {
      const events = await getUnsyncedEvents();
      
      if (events.length === 0) {
        setIsSyncing(false);
        return;
      }

      const response = await fetch('http://localhost:8000/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: events.map(e => ({
            userId: e.userId,
            gameId: e.gameId,
            sessionId: e.sessionId,
            timestamp: e.timestamp,
            type: e.type,
            payload: e.payload,
            clientSeq: e.timestamp,
          }))
        }),
      });

      if (response.ok) {
        const result = await response.json();
        await markEventsSynced(events.map(e => e.id));
        setLastSync(new Date());
        console.log(`Synced ${result.synced} events`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(syncEvents, 30000);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncEvents();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    syncEvents();

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { isSyncing, lastSync, syncEvents };
}
