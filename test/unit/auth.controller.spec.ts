import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LogInDto } from '../../src/auth/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('토큰값을 받아옵니다.', async () => {
      const loginDTO: LogInDto = {
        userName: 'testUser1',
        password: '1234',
      };

      jest
        .spyOn(service, 'signIn')
        .mockReturnValue(
          Promise.resolve({ accessToken: 'This_is_JWT_Token_value' }),
        );

      const rst = await controller.signIn(loginDTO);

      expect(rst).toEqual({ accessToken: 'This_is_JWT_Token_value' });
      expect(service.signIn).toBeCalledTimes(1);
      expect(service.signIn).toBeCalledWith(loginDTO);
    });
  });
});
