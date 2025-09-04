export const CHALLENGE_CONSTRAINTS = {
  SYNC_ORDER: 'chronological-per-task',
  CONFLICT_PRIORITY: {
    delete: 3,
    update: 2,
    create: 1,
  },
  ERROR_HANDLING: 'dead-letter-queue',
  BATCH_INTEGRITY: 'checksum-required',
  SYNC_STATES: ['pending', 'in-progress', 'synced', 'error', 'failed'],
};
