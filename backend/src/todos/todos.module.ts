import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodoRepositoryImpl } from './repositories/todo.repository';

@Module({
  controllers: [TodosController],
  providers: [TodosService, TodoRepositoryImpl],
})
export class TodosModule {}
