import React from 'react'
import { Link } from 'react-router-dom'
import {useEffect} from "react";
import Loading from "../components/rusable/Loading";
const NotFound = () => {

  useEffect(() => {
    document.title = "Not Found";
  }, []);

  return (
    <>
      <Loading />
    <div className='flex flex-col items-center justify-center gap-10 h-[100vh]'>
      <h1 className='text-center text-3xl text-black dark:text-white'>Page Not Found</h1>
      <h2 className='text-center text-3xl text-black dark:text-white'>404</h2>
      <Link to={'/'} className='text-center block text-2xl text-white hover:scale-110 duration-500 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-semibold py-2 px-6 rounded-lg mt-5'>
        Go back
      </Link>

    </div>
    </>
  )
}

export default NotFound
