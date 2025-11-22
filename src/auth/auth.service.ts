import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, name, username, birthDate } = registerUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          username,
          birthDate: new Date(birthDate),
          userAvatar: "👤",
          age: 0,
          weight: 0,
          height: 0,
        },
      });

      // Don't return password
      const { password, ...result } = user;
      return result;

    } catch (error) {
      if (error.code === 'P2002') { // Prisma unique constraint violation
        throw new ConflictException('Email or username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);
      
      const { password, ...result } = user;
      return { user: result, token: accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
