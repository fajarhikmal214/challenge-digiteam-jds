import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/models/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GoogleAuthenticateDto } from './dto/google-authenticate.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { GetUser } from './get-user.decorator';
import lang from '../../language/configuration';

@Controller('v1/auth/users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() response): Promise<any> {
    const data = await this.authService.signIn(signInDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.signin.success'),
      data,
    });
  }

  @Post('/google/authenticate')
  async authenticate(
    @Body() googleAuthenticateDto: GoogleAuthenticateDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.googleAuthenticate(
      googleAuthenticateDto,
    );

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.signin.success'),
      data,
    });
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  async me(@GetUser() user: User, @Res() response): Promise<void> {
    const data = await this.authService.me(user);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.me.success'),
      data,
    });
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.refreshToken(refreshTokenDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.refreshToken.success'),
      data,
    });
  }

  @Post('/sign-out')
  @UseGuards(AuthGuard())
  async signOut(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() response,
  ): Promise<void> {
    const data = await this.authService.signOut(refreshTokenDto);

    return response.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: lang.__('auth.signout.success'),
      data,
    });
  }
}
