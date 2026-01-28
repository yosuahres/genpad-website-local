import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();

  console.log('Middleware triggered for:', url.pathname);
  console.log('Session:', user);
  console.log('Session details:', user);
  console.log('Error:', error);

  if (url.pathname.startsWith('/dashboard')) {
    if (!user) {
      console.log('Redirecting to /login');
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith('/login') || url.pathname.startsWith('/register')) {
    if (user) {
      console.log('Redirecting to /dashboard');
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};