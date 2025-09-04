import { Router, Request, Response } from 'express';
import { SyncService } from '../services/syncService';
import { TaskService } from '../services/taskService';
import { Database } from '../db/database';

export function createSyncRouter(db: Database): Router {
  const router = Router();
  const taskService = new TaskService(db);
  const syncService = new SyncService(db, taskService);

  router.post('/sync', async (req: Request, res: Response) => {
    try {
      const result = await syncService.sync();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Sync failed' });
    }
  });

  router.get('/status', async (req: Request, res: Response) => {
    try {
      const status = await syncService.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sync status' });
    }
  });

  router.get('/health', async (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date() });
  });

  return router;
}
