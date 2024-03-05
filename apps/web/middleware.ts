import { NextRequest, NextResponse } from 'next/server';

export const protectedRoutes = ['/home', '/messages', '/grades'];
export const authRoutes = ['/'];

export function middleware(request: NextRequest) {
	const currentUser = request.cookies.get('accessToken')?.value;

	if (protectedRoutes.includes(request.nextUrl.pathname) && !currentUser) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
		return NextResponse.redirect(new URL('/home', request.url));
	}
}
