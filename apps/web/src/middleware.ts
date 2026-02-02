import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const url = request.nextUrl.clone();

  // Guard Dashboard Routes
  if (url.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Fetch user profile to check role
    const { data: profile } = await supabase
      .from('users')
      .select('role_id')
      .eq('id', user.id)
      .single();

    // 1. Superadmin Route Protection
    if (url.pathname.startsWith('/dashboard/superadmin') && profile?.role_id !== 1) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    // 2. Admin Route Protection
    if (url.pathname.startsWith('/dashboard/admin') && profile?.role_id !== 2) {
      return NextResponse.redirect(new URL('/dashboard/superadmin', request.url));
    }
  }

  // Handle Auth Pages (prevent logged-in users from seeing login/register)
  const isAuthPage = url.pathname === '/login' || url.pathname === '/register' || url.pathname === '/';
  if (isAuthPage && user) {
     // Fetch role to know where to redirect from the root/login
     const { data: profile } = await supabase
      .from('users')
      .select('role_id')
      .eq('id', user.id)
      .single();
      
     const target = profile?.role_id === 1 ? '/dashboard/superadmin' : '/dashboard/admin';
     return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};