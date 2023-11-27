import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RegisterUser } from './dto/registerUser.dto';

describe('UserController', () => {
  let controller: UserController;
  const mockUserService = {
    signUp: jest.fn(),
  };
  const userDTO: RegisterUser = {
    userName: 'testUser',
    password: '1234@',
  };
  const signUpSpy = jest
    .spyOn(mockUserService, 'signUp')
    .mockResolvedValue({ message: '회원가입에 성공했습니다' });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signUp', async () => {
    const rst = await controller.signUp(userDTO);

    expect(rst).toEqual({ message: '회원가입에 성공했습니다' });
    expect(signUpSpy).toBeCalledTimes(1);
    expect(signUpSpy).toBeCalledWith(userDTO);
  });
});
