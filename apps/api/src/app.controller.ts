import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  @UseGuards(AuthGuard)
  @Get('protected-data')
  getHello(@Request() req): string {
    if (!req.user || !req.user.email) {
      throw new UnauthorizedException('User information is missing');
    }

    return `Hello User ${req.user.email}, this data is from the backend!`;
  }
}