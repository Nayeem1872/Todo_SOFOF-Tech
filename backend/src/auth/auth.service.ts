import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { users } from '../database/schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('DATABASE_CONNECTION') private db: MySql2Database,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.username, signupDto.username))
      .limit(1);

    if (existingUser.length > 0) {
      throw new BadRequestException('Username already exists');
    }

    const existingEmail = await this.db
      .select()
      .from(users)
      .where(eq(users.email, signupDto.email))
      .limit(1);

    if (existingEmail.length > 0) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const newUser = await this.db.insert(users).values({
      id: uuidv4(),
      username: signupDto.username,
      email: signupDto.email,
      password: hashedPassword,
    });

    const payload = { username: signupDto.username, sub: newUser[0].insertId };
    return {
      message: 'User created successfully',
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.username, loginDto.username))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user[0].password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user[0].username, sub: user[0].id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
