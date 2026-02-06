import { Injectable } from '@nestjs/common';
import { BaseSupabaseService } from '../common/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ChildrenService extends BaseSupabaseService {
  constructor(supabase: SupabaseService) {
    super(supabase, 'children');
  }

  // Override findAll to include relations
  async findAllExtended(page: number, limit: number) {
    return this.findAll(page, limit, `
      *,
      region:regions(name),
      academic_year:academic_years(year_label)
    `);
  }
}