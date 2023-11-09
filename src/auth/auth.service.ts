import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LogInDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(logIntDto: LogInDto): Promise<{ accessToken: string }> {
    try {
      const { userName, password } = logIntDto;
      const user = await this.userRepository.findOne({ where: { userName } });

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = { userName };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
      } else {
        throw new UnauthorizedException('로그인 실패');
      }
    } catch (error) {
      throw new InternalServerErrorException('로그인 중 에러가 발생했습니다.');
    }
  }
}
