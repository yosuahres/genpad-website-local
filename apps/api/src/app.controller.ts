import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from './supabase/supabase.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) {}

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
  async createUser(@Body() body: any) {
    const adminClient = this.supabaseService.getAdminClient();
    
    
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { name: body.name }
    });

    if (authError) throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);

    
    const targetRole = body.role_id || 3;

    const { error: dbError } = await adminClient
      .from('users')
      .update({ role_id: targetRole, name: body.name })
      .eq('id', authUser.user.id);

    if (dbError) {
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      throw new HttpException("Failed to set role in database", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return authUser.user;
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: { name: string }) {
    const { data, error } = await this.supabaseService.getAdminClient()
      .from('users')
      .update({ name: body.name })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const adminClient = this.supabaseService.getAdminClient();
    const { error: authError } = await adminClient.auth.admin.deleteUser(id);
    
    if (authError) throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);
    return { success: true };
  }
}