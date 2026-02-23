// apps/api/src/children/children.service.ts
import { Injectable } from '@nestjs/common';
import { BaseSupabaseService } from '../common/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ChildrenService extends BaseSupabaseService {
  constructor(supabase: SupabaseService) {
    super(supabase, 'children'); 
  }
  
  async findAllExtended(page: number, limit: number) {
    return this.findAll(page, limit, `
      *,
      region:region_id(name),
      academic_year:academic_year_id(year_label),
      parent_asuh:parent_asuh_id(name)
    `);
  }
}