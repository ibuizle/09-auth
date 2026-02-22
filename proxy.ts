import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_PREFIXES = ['/sign-in', '/sign-up'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ критично: не чіпаємо API та системні маршрути Next
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  // ✅ accessToken нема, але refreshToken є → пробуємо відновити сесію
  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();

      if (res.data) isAuthenticated = true;

      // ✅ прокидаємо set-cookie (якщо бек оновив токени)
      const setCookie = res.headers?.['set-cookie'];
      if (setCookie) {
        const next = NextResponse.next();

        if (Array.isArray(setCookie)) {
          setCookie.forEach((c) => next.headers.append('set-cookie', c));
        } else {
          next.headers.append('set-cookie', setCookie);
        }

        // застосовуємо правила редіректу з оновленими cookies
        if (isPrivate && !isAuthenticated) {
          const url = req.nextUrl.clone();
          url.pathname = '/sign-in';
          url.search = '';
          return NextResponse.redirect(url, { headers: next.headers });
        }

        if (isAuth && isAuthenticated) {
          const url = req.nextUrl.clone();
          url.pathname = '/profile';
          url.search = '';
          return NextResponse.redirect(url, { headers: next.headers });
        }

        return next;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // базові редіректи
  if (isPrivate && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isAuth && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = '/profile';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}