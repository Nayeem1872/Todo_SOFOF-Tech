import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TodoStatus } from '../enums/todo-status.enum';

export class UpdateTodoDto {
  @ApiPropertyOptional({ description: 'Title of the todo', example: 'Buy groceries' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Description of the todo', example: 'Buy milk, eggs, and bread' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Status of the todo', 
    enum: TodoStatus 
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}
