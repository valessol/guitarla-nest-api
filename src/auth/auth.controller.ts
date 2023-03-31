import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/register') // POST auth/register is used to create a new user
  async register(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.addUser(createUserDTO);
    return user;
  }

  @UseGuards(LocalAuthGuard) // To verify the user, we use the LocalAuthGuard
  @Post('/login') // POST auth/login is used to log in a registered user
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // We used JwtGuard to authenticate the user and RolesGuard plus @Roles decorator to provide the appropriate authorization depending on the user’s roles
  @Roles(Role.User)
  @Get('/user') // GET auth/user is used to access the user’s profile
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('/admin') // GET auth/admin is used to access the admin dashboard
  getDashboard(@Request() req) {
    return req.user;
  }
}
