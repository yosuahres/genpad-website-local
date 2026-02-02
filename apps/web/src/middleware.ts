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

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user) {
    // We use 'any' here to prevent the 'never' property error during the join
    const { data: userData }: any = await supabase
      .from('users')
      .select('roles(name)')
      .eq('id', user.id)
      .single();

    // Safely extract the role name
    const roleData = userData?.roles;
    const role = Array.isArray(roleData) ? roleData[0]?.name : roleData?.name;

    // // Route Protection
    // if (request.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    //   return NextResponse.redirect(new URL('/dashboard/superadmin', request.url));
    // }

    // if (request.nextUrl.pathname.startsWith('/dashboard/superadmin') && role !== 'superadmin') {
    //   return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    // }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};