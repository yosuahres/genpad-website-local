// apps/api/src/children/children.service.ts
import { Injectable } from '@nestjs/common';
import { BaseSupabaseService } from '../common/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';

// apps/api/src/children/children.service.ts
@Injectable()
export class ChildrenService extends BaseSupabaseService {
  constructor(supabase: SupabaseService) {
    super(supabase, 'children'); 
  }
  
  async findAllExtended(page: number, limit: number) {
    console.log('DEBUG: Executing findAllExtended with parent_asuh(phone_number)');
    return this.findAll(page, limit, `
      *,
      region:region_id(name),
      academic_year:academic_year_id(year_label),
      parent_asuh:parent_asuh_id(name, phone_number) 
    `); // Added phone_number here
  }
}