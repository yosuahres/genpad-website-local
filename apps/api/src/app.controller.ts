// apps/api/src/app.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpException, HttpStatus, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from './supabase/supabase.service';
import { AuditService } from './audit/audit.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class AppController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly auditService: AuditService
  ) {}

  @Get()
  async getUsers(@Query('roleId') roleId?: string) {
    const query = this.supabaseService.getClient().from('users').select('*');
    if (roleId) {
      query.eq('role_id', parseInt(roleId));
    }
    const { data, error } = await query;
    if (error) throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    return data;
  }

  @Post()
  async createUser(@Request() req, @Body() body: any) {
    const adminClient = this.supabaseService.getAdminClient();
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { name: body.name }
    });

    if (authError) throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);

    const targetRole = body.role_id || 3;
    await adminClient.from('users').update({ role_id: targetRole, name: body.name }).eq('id', authUser.user.id);

    await this.auditService.createLog({
      user_id: req.user.id,
      action: 'CREATE_USER',
      entity_type: 'user',
      entity_id: authUser.user.id,
      new_value: { email: body.email, name: body.name, role_id: targetRole }
    });

    return authUser.user;
  }

  @Put(':id')
  async updateUser(@Request() req, @Param('id') id: string, @Body() body: any) {
    const adminClient = this.supabaseService.getAdminClient();
    const { data: oldUser } = await adminClient.from('users').select('*').eq('id', id).single();

    const { data, error } = await adminClient
      .from('users')
      .update({ name: body.name, role_id: body.role_id })
      .eq('id', id)
      .select().single();
      
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

    await this.auditService.createLog({
      user_id: req.user.id,
      action: 'UPDATE_USER',
      entity_type: 'user',
      entity_id: id,
      old_value: oldUser,
      new_value: data
    });

    return data;
  }

  @Delete(':id')
  async deleteUser(@Request() req, @Param('id') id: string) {
    const adminClient = this.supabaseService.getAdminClient();
    const { data: oldUser } = await adminClient.from('users').select('*').eq('id', id).single();

    const { error: authError } = await adminClient.auth.admin.deleteUser(id);
    if (authError) throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);

    await this.auditService.createLog({
      user_id: req.user.id,
      action: 'DELETE_USER',
      entity_type: 'user',
      entity_id: id,
      old_value: oldUser
    });

    return { success: true };
  }
}