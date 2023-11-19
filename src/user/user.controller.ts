import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUser } from './dto/registerUser.dto';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('유저')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '회원가입 API',
    description: '유저를 등록합니다.',
  })
  @ApiResponse({ status: 201, description: 'success' })
  @Post('/signup')
  signUp(@Body(ValidationPipe) registerUser: RegisterUser): Promise<object> {
    return this.userService.signUp(registerUser);
  }
}
