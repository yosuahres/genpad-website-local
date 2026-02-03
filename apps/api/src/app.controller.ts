// apps/api/src/app.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupabaseService } from './supabase/supabase.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class AppController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async getAdmins() {
    const { data, error } = await this.supabaseService.getClient()
      .from('users') // Adjust to 'users' if your public table is named that
      .select('*')
      .eq('role_id', 2);
    if (error) throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    return data;
  }

  @Post()
  async createAdmin(@Body() body: any) {
    const adminClient = this.supabaseService.getAdminClient();
    
    // 1. Create in Supabase Auth (Triggers your SQL function)
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      user_metadata: { name: body.name }
    });

    if (authError) throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);

    // 2. Ensure role_id is 2
    const { error: dbError } = await adminClient
      .from('users')
      .update({ role_id: 2, name: body.name })
      .eq('id', authUser.user.id);

    if (dbError) {
      await adminClient.auth.admin.deleteUser(authUser.user.id);
      throw new HttpException("Failed to set role", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return authUser.user;
  }

  @Put(':id')
  async updateAdmin(@Param('id') id: string, @Body() body: { name: string }) {
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
    // Delete from Auth (CASCADE should handle the rest, but we can be explicit)
    const { error: authError } = await adminClient.auth.admin.deleteUser(id);
    if (authError) throw new HttpException(authError.message, HttpStatus.BAD_REQUEST);
    
    await adminClient.from('users').delete().eq('id', id);
    return { success: true };
  }
}