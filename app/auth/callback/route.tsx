import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const nextUrl = new URL("/", request.nextUrl.origin)

  // 获取token_hash和type
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // 返回主页
      return NextResponse.redirect(nextUrl)
    }
  }

  // 如果有问题，重定向到error页
  nextUrl.pathname = "/error"
  return NextResponse.redirect(nextUrl)
}