"use client";

import { useSync } from '@/hooks/useSync';

export function SyncProvider() {
  const { isSyncing } = useSync();

  if (!isSyncing) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
      🔄 Syncing...
    </div>
  );
}
