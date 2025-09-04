import { Database } from '../db/database';
import { Task } from '../types';

export class TaskService {
  constructor(private db: Database) {}

  async getAllTasks(): Promise<Task[]> {
    const rows = await this.db.all(`SELECT * FROM tasks WHERE is_deleted = 0`);
    return rows as Task[];
  }

  async getTask(id: string): Promise<Task | null> {
    const row = await this.db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
    return row || null;
  }

  async createTask(task: Task): Promise<void> {
    const sql = `
      INSERT INTO tasks (
        id, title, description, completed, created_at, updated_at, is_deleted, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await this.db.run(sql, [
      task.id,
      task.title,
      task.description || null,
      task.completed ? 1 : 0,
      task.created_at,
      task.updated_at,
      task.is_deleted ? 1 : 0,
      task.sync_status || 'pending',
    ]);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const sql = `
      UPDATE tasks
      SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await this.db.run(sql, [
      updates.title || null,
      updates.description || null,
      updates.completed ? 1 : 0,
      id,
    ]);
  }

  async deleteTask(id: string): Promise<void> {
    const sql = `UPDATE tasks SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await this.db.run(sql, [id]);
  }
}
