import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async () => {
        const connection = await mysql.createConnection({
          host: process.env.DATABASE_HOST || 'localhost',
          port: Number(process.env.DATABASE_PORT) || 3306,
          user: process.env.DATABASE_USER || 'root',
          password: process.env.DATABASE_PASSWORD || 'password',
          database: process.env.DATABASE_NAME || 'todo_db',
        });
        return drizzle(connection, { schema, mode: 'default' });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
