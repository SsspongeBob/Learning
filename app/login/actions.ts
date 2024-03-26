'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers";
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const credentials = {
    email,
    password
  }

  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout")
  return redirect("/");
}

export async function signup(formData: FormData) {
  const origin = headers().get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const credentials = {
    email,
    password
  }

  const { error } = await supabase.auth.signUp(credentials)

  if (error) {
    return redirect("/login?message=Could not create user");
  }

  revalidatePath("/", "layout")
  return redirect("/login?message=Check email to continue sign in process");
}