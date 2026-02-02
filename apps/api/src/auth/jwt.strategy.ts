// apps/api/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';

// Explicitly define the database response structure
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
    console.log('JWT Payload received:', payload); // If this doesn't show up, check your SECRET
    const supabase = this.supabaseService.getClient();

    // Cast the response to our interface to stop the 'never' error
    const { data, error } = await supabase
      .from('users')
      .select('id, email, roles(name)')
      .eq('id', payload.sub)
      .single() as { data: UserWithRole | null; error: any };

    if (error || !data) {
      throw new UnauthorizedException('User record or role not found');
    }

    // Extract the role name safely from either an array or an object
    let roleName = 'user'; // default
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