import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUser } from './dto/registerUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) registerUser: RegisterUser): Promise<object> {
    return this.userService.signUp(registerUser);
  }
}
