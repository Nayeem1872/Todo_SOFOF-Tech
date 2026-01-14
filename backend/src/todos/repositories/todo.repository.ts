import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { todos, Todo } from '../../database/schema';
import { TodoRepository } from '../interfaces/todo-repository.interface';
import { TodoStatus } from '../enums/todo-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoRepositoryImpl implements TodoRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: MySql2Database,
  ) {}

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = {
      id: uuidv4(),
      title: todo.title,
      description: todo.description || null,
      status: todo.status || TodoStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.db.insert(todos).values(newTodo);
    return newTodo as Todo;
  }

  async findAll(status?: TodoStatus): Promise<Todo[]> {
    if (status) {
      return this.db.select().from(todos).where(eq(todos.status, status));
    }
    return this.db.select().from(todos);
  }

  async findById(id: string): Promise<Todo | null> {
    const result = await this.db.select().from(todos).where(eq(todos.id, id));
    return result[0] || null;
  }

  async update(id: string, data: Partial<Todo>): Promise<Todo> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    await this.db
      .update(todos)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(todos.id, id));

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    await this.db.delete(todos).where(eq(todos.id, id));
  }
}
