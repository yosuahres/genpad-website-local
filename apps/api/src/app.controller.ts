import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('jwt')) 
  @Get('protected-data')
  getHello(@Request() req) {
    return {
      message: `Hello User ${req.user.email}, this data is from the backend!`,
    };
  }
}