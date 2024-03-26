import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const Home = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) redirect('/login')

  return (
    <div>Hello {data.user.email} <Link href="/todos" className='block'>Todo List</Link></div>
  )
}

export default Home