import { z, ZodError } from 'zod'
import to from 'await-to-js'
import { sha256 } from 'js-sha256'
import { getUserByAccount } from '@/action/user'
import cookie from 'cookie'
import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const loginForm = z.object({
  account: z.string({ required_error: '请输入用户名' }),
  password: z.string({ required_error: '请输入密码' })
})

export async function POST (req: NextRequest, res: NextResponse) {
  const body = await req.json()
  const [err, form] = await to(loginForm.parseAsync(body))
  
  if (err) {
    return Response.json({ message: (err as ZodError).message }, { status: 400 })
  }
  
  const password = sha256.create().update(form.password).toString()
  
  const [e, user] = await to(getUserByAccount(form.account!))
  
  if (e) {
    return Response.json({ message: '服务器错误' }, { status: 500 })
  }
  
  if (!user) {
    return Response.json({ message: '用户名或密码错误' }, { status: 401 })
  }
  

  
  if (password !== user.password) {
    return Response.json({ message: '用户名或密码错误' }, { status: 401 })
  }
  
  const token = await new SignJWT({ id: user.id }).setProtectedHeader({alg: 'HS256'}).sign(
    new TextEncoder().encode(process.env.JWT_TOKEN_SECRET!)
  )
  
  const r = Response.json({token})
  
  const cookies = cookie.serialize('jwt-admin-token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: process.env.JWT_TOKEN_EXPIRE
  })
  
  r.headers.set('Set-Cookie', cookies)
  
  return r
}

export const dynamic = 'force-dynamic'
