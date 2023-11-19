import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인 API',
    description: '호출자 로그인 후 토큰을 응답합니다.',
  })
  @ApiResponse({ status: 201, description: 'success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'InternalServerError.' })
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) logInDto: LogInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(logInDto);
  }
}
