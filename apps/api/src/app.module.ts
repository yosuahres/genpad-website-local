// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { ChildrenModule } from './children/children.module';
import { RegionsModule } from './regions/regions.module';
import { TemplateCardsModule } from './template-cards/template-cards.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit-logs/audit.module';
import { DocumentsModule } from './documents/documents.module'; 
import { ParentAsuhModule } from 'parent_asuh/parent-asuh.module';
import { MessagingModule } from 'messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    AcademicYearsModule,
    ChildrenModule,
    RegionsModule,
    TemplateCardsModule,
    AuditModule,
    DocumentsModule, 
    ParentAsuhModule ,
    MessagingModule
  ],
  controllers: [AppController],
})
export class AppModule {}