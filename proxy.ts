import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const PUBLIC_AUTH_PAGES = ['/sign-in', '/sign-up'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublicAuth = PUBLIC_AUTH_PAGES.some((p) => pathname.startsWith(p));

  const accessToken = req.cookies.get('accessToken')?.value;
  const isAuthed = Boolean(accessToken);

  if (isPrivate && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isPublicAuth && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/profile';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
