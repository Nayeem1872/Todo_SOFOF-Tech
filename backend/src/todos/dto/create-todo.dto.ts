import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TodoStatus } from '../enums/todo-status.enum';

export class CreateTodoDto {
  @ApiProperty({ description: 'Title of the todo', example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Description of the todo', example: 'Buy milk, eggs, and bread' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Status of the todo', 
    enum: TodoStatus,
    default: TodoStatus.PENDING 
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}
