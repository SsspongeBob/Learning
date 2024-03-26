"use client"
import React, { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { addData, getData, deleteData, putData } from './actions'
import { SubmitButton } from './submit-button'

interface Msg {
  id: number
  title: string
  finished: boolean
  error?: boolean
}

const Todos = () => {

  // 获取todos部分
  const [todos, setTodos] = useState<Array<Msg> | null>(null) // 获取数据库总数据

  // 添加todos部分
  const [msg, setMsg] = useState<string>("") // 添加单条todo
  const [visible, setVisible] = useState<boolean>(false) // spin显示状态
  const spinRef = useRef<SVGSVGElement | null>(null) // 获取spin SVG标签
  const inputRef = useRef<HTMLInputElement | null>(null) // 获取input框

  // 修改todos部分
  const [visible2, setVisible2] = useState<boolean>(false) // spin显示状态

  // 查找todos部分

  // 初次渲染获取所有todos
  useEffect(() => {
    async function fetchDatabase() {
      // 获取所有数据并渲染
      const data: Msg[] = await getData()
      // 升序排列
      setTodos(data.sort((a, b) => a.id - b.id))
    }
    fetchDatabase()
  }, [])

  // 重新获取所有数据
  async function getAllTodos() {
    try {
      // 获取所有数据
      const data: Msg[] = await getData()
      // 升序排列并渲染
      setTodos(data.sort((a, b) => a.id - b.id))
    } catch (error) {
      console.log(error);
    }
  }

  //// 增
  async function addTodo(formdata: FormData) {
    // 输入框失去焦点
    (inputRef.current as HTMLInputElement).blur();
    // 显示加载状态 由于渲染机制，这边需要强制渲染
    // 但是强制渲染会导致useFormStatus失效
    // flushSync(() => {
    //   setVisible(true)
    // })
    // 因此改为用useRef直接操控元素
    (spinRef.current as SVGSVGElement).style.visibility = "visible"
    const title = formdata.get("title") as string
    // 清空输入框 由于渲染机制，这里就有问题
    setMsg('')
    // 增加数据
    await addData(title)
    // 重新获取数据
    await getAllTodos();
    // 隐藏加载状态
    // setVisible(false);
    (spinRef.current as SVGSVGElement).style.visibility = "hidden"
  }

  //// 删
  async function deleteTodo(e: React.MouseEvent<HTMLOrSVGElement>) {
    // 保证id不为空 这边一定要是currentTarget而不是target
    if ((e.currentTarget as SVGAElement).dataset.id) {
      // 显示加载状态
      setVisible2(true)
      try {
        // 根据id删除指定todo
        const res = await deleteData(parseInt((e.currentTarget as SVGAElement).dataset.id!))
        // 捕获异常
        // if (res[0].error) alert("Delete failed!")
        // 重新获取数据
        await getAllTodos()
        // 隐藏加载状态
        setVisible2(false)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("date-id is empty: ", e.currentTarget);
    }
  }

  //// 改
  async function updateTodo(e: React.ChangeEvent<HTMLInputElement>) {
    // 显示加载状态
    setVisible2(true)
    // 更新数据库数据
    const res = await putData(parseInt(e.target.id), e.target.checked)
    // 反馈更新不成功
    // if (res[0].error) alert("Update failed!")
    // 重新获取数据
    await getAllTodos()
    // 隐藏加载状态
    setVisible2(false)
  }

  //// 查


  return (
    <fieldset className='flex flex-col items-center mx-auto w-1/3 mt-10 mb-10 pt-4 shadow-[0px_0px_60px_-15px_rgba(0,0,0,0.3)] rounded-lg divide-y'>
      <div className='flex self-stretch items-center mb-2'>
        <h1 className='font-serif ml-8 -mt-1 text-xl text-white text-nowrap before:block before:absolute before:-z-10 before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative'>Todo List</h1>
        <form className='inline-flex grow items-center justify-around'>
          <input type="text" placeholder='write some todos ...'
            className="ml-6 mr-0.5 p-1 border pl-2 border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:italic caret-sky-500 placeholder:text-slate-400 transition-all"
            name='title'
            value={msg}
            onChange={e => setMsg(e.target.value)}
            ref={inputRef}
            required
          />
          <svg
            ref={spinRef}
            className={`ml-1 p-0.5 mr-1 rounded transition animate-spin invisible`}
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
          <SubmitButton
            pendingText='Adding...'
            formAction={addTodo}
            className="inline-flex font-serif truncate items-center px-2 py-1 mr-1 rounded-md text-white shadow-inner shadow-slate-400/40 bg-[#37996b]/90 hover:bg-[#37996b]/80 active:bg-[#37996b] focus:outline-none transition duration-200"
          >
            <div className='mr-1'>Add</div>{" "}
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </SubmitButton>
        </form>
      </div>
      {!todos ? <p className='mb-2'>Loading for fetching data...</p> : todos[0].error ? <p className='mb-2'>Failing to fetch data, please try again later.</p> : todos.map(todo => (
        <div className='flex flex-row items-center last:mb-3 even:bg-slate-50' key={todo.id}>
          <label htmlFor={String(todo.id)} className='has-[:checked]:line-through peer flex flex-row items-center cursor-pointer hover:bg-slate-200 transition-colors p-1 pl-2 rounded-md w-[24rem]'>
            <input
              type="checkbox"
              id={String(todo.id)}
              className='mr-2 accent-pink-500 cursor-pointer'
              checked={todo.finished}
              onChange={updateTodo}
            />
            <p className='truncate'>{todo.title}</p>
          </label>
          {visible2 ?
            <svg
              className='ml-2 p-0.5 mr-1 rounded transition animate-spin'
              width="18"
              height="18"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
            :
            <svg
              className='peer-has-[:checked]:invisible ml-2 p-0.5 mr-1 rounded cursor-pointer hover:bg-red-200 hover:stroke-red-400 transition'
              width="18"
              height="18"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-id={String(todo.id)}
              onClick={deleteTodo}
            >
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor "
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          }
        </div>
      ))}
    </fieldset>
  )
}

export default Todos