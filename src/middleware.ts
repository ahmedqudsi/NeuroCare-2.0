
import { NextRequest, NextResponse } from 'next/server';

// Middleware is no longer used for i18n routing after the revert.
// This is a basic pass-through middleware.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // We keep the matcher to ensure middleware still runs,
  // even if it's just a pass-through for now.
  // Adjust this matcher if you have other middleware needs in the future.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images/).*)'],
};
