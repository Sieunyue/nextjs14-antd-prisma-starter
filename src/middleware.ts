import { NextRequest, NextResponse } from 'next/server'
import { pathToRegexp } from 'path-to-regexp'
import { jwtVerify } from 'jose'

const whiteList = [
  '/admin/login'
]


export async function middleware(request: NextRequest) {
  if (whiteList.some(s => pathToRegexp(s).test(request.nextUrl.pathname))) {
    return NextResponse.next()
  } else {
    const token = request.cookies.get('jwt-admin-token')
    
    if (!token) {
      const rUrl = request.nextUrl.clone()
      rUrl.pathname = '/admin/login'
      return NextResponse.redirect(rUrl)
    }
    
    try {
      const decoded = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_TOKEN_SECRET))

      if(!decoded.payload){
        throw new Error('Invalid token')
      }

      const response = NextResponse.next()
      
      response.cookies.set({
        name: 'jwt-admin-token',
        value: token.value,
        maxAge: process.env.JWT_TOKEN_EXPIRE
      })
      
      return response
    } catch (e) {
      const rUrl = request.nextUrl.clone()
      rUrl.pathname = '/admin/login'
      const url = NextResponse.redirect(rUrl)
      url.cookies.delete('jwt-admin-token')
      return url
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
