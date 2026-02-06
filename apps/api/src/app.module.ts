import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';

// Import the 4 new modules
import { RegionsModule } from './regions/regions.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { TemplateCardsModule } from './template-cards/template-cards.module';
import { ChildrenModule } from './children/children.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
    AuditModule,
    RegionsModule,
    AcademicYearsModule,
    TemplateCardsModule,
    ChildrenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}