import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // 1. Guest trying to access dashboard
  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user) {
    const { data: userData }: any = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single();

    const role = Array.isArray(userData?.roles) ? userData?.roles[0]?.name : userData?.roles?.name;

    // 2. Logged in but record not synced yet or no permission
    if (!role && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
    }

    // 3. Admin restricted to Admin Dashboard
    if (role === 'admin' && pathname.startsWith('/dashboard/superadmin')) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    // 4. Superadmin restricted to Superadmin Dashboard
    if (role === 'superadmin' && pathname.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL('/dashboard/superadmin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};