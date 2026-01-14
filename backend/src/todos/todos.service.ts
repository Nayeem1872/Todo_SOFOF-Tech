import { Injectable } from '@nestjs/common';
import { TodoRepositoryImpl } from './repositories/todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoStatus } from './enums/todo-status.enum';
import { Todo } from '../database/schema';

@Injectable()
export class TodosService {
  constructor(private readonly todoRepository: TodoRepositoryImpl) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.create(createTodoDto);
  }

  async findAll(status?: TodoStatus): Promise<Todo[]> {
    return this.todoRepository.findAll(status);
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findById(id);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todoRepository.update(id, updateTodoDto);
  }

  async remove(id: string): Promise<void> {
    return this.todoRepository.delete(id);
  }
}
