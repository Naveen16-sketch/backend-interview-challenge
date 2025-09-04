import { Router, Request, Response } from 'express';
import { TaskService } from '../services/taskService';
import { SyncService } from '../services/syncService';
import { Database } from '../db/database';

export function createTaskRouter(db: Database): Router {
  const router = Router();
  const taskService = new TaskService(db);
  const syncService = new SyncService(db, taskService);

  // Get all tasks
  router.get('/', async (req: Request, res: Response): Promise<Response> => {
    try {
      const tasks = await taskService.getAllTasks();
      return res.json(tasks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  // Get task by ID
  router.get('/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
      const task = await taskService.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch task' });
    }
  });

  // Create task
  router.post('/', async (req: Request, res: Response): Promise<Response> => {
    try {
      const task = req.body;
      await taskService.createTask(task);
      return res.status(201).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // Update task
  router.put('/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
      await taskService.updateTask(req.params.id, req.body);
      return res.json({ message: 'Task updated' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // Delete task
  router.delete('/:id', async (req: Request, res: Response): Promise<Response> => {
    try {
      await taskService.deleteTask(req.params.id);
      return res.json({ message: 'Task deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  return router;
}
