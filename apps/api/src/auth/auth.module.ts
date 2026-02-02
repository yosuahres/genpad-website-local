import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller'; // Import the controller

@Module({
  imports: [PassportModule],
  controllers: [AuthController], // Add this line
  providers: [JwtStrategy],
})
export class AuthModule {}