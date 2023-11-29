import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LogInDto } from 'src/auth/dto/login.dto';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {};

  const loginDTO: LogInDto = {
    userName: 'testUser1',
    password: '1234',
  };

  const mockUser = {
    id: 'testUser1',
    userName: 'testUser1',
    password: '$2a$10$EgPpq0zKX0.enukiwZX8Juh3JMWt02qZWlLWot5CxSTDgm1zaew9m',
    morningConsultingYn: true,
    eveningConsultingYn: true,
    discordUrl: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  let findOneSpy = jest
    .spyOn(mockRepository, 'findOne')
    .mockResolvedValue(mockUser);

  const signAsyncSpy = jest
    .spyOn(mockJwtService, 'signAsync')
    .mockResolvedValue('jwt-token');

  it('correct testing', async () => {
    const result = await service.signIn(loginDTO);

    expect(result).toEqual({ accessToken: 'jwt-token' });
    expect(findOneSpy).toBeCalledTimes(1);
    expect(signAsyncSpy).toBeCalledTimes(1);
  });

  it('wrong password', async () => {
    loginDTO.password = '12345';
    try {
      await service.signIn(loginDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(findOneSpy).toBeCalledTimes(2); // 위에 테스트 포함
    }
  });

  it('no user', async () => {
    findOneSpy = jest
      .spyOn(mockRepository, 'findOne')
      .mockResolvedValue(undefined);

    try {
      await service.signIn(loginDTO);
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException);
    }
  });
});
