// apps/api/src/app.controller.ts
import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root(): string {
    return 'Health check ok!';
  }
}