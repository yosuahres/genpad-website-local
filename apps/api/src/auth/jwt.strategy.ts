
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';


interface UserWithRole {
  id: string;
  email: string;
  roles: { name: string } | { name: string }[] | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET'),
      jsonWebTokenOptions: {
        ignoreNotBefore: true, 
      },
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload received:', payload); 
    const supabase = this.supabaseService.getClient();

    
    const { data, error } = await supabase
      .from('users')
      .select('id, email, roles(name)')
      .eq('id', payload.sub)
      .single() as { data: UserWithRole | null; error: any };

    if (error) {
        console.error('Database Query Error:', error); 
        throw new UnauthorizedException(`Database error: ${error.message}`);
    }

    if (!data) {
        console.error('No user record found for ID:', payload.sub);
        throw new UnauthorizedException('User record not found in database');
    }

    
    let roleName = 'user'; 
    if (data.roles) {
      if (Array.isArray(data.roles)) {
        roleName = data.roles[0]?.name;
      } else {
        roleName = data.roles.name;
      }
    }

    return {
      id: data.id,
      email: data.email,
      role: roleName,
    };
  }
}