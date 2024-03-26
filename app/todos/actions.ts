"use server"
import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

// 增
export async function addData(title: string) {
  const { data, error } = await supabase.from("notes").insert([{ "title": title }]).select()

  if (!error || data) return data
  throw new Error("Unable to add data...")
}

// 删
export async function deleteData(id: number) {
  const { data, error } = await supabase.from("notes").delete().eq("id", id).select()

  if (!error || data) return data
  throw new Error("Unable to delete data...")
}

// 改
export async function putData(id: number, finished: boolean) {
  const { data, error } = await supabase.from("notes").update({ "finished": finished }).eq("id", id).select()

  if (!error || data) return data
  throw new Error("Unable to update data...")
}

// 查
export async function getData() {
  const { data, error } = await supabase.from("notes").select()

  if (!error || data) return data
  throw new Error("Unable to get data...")
}