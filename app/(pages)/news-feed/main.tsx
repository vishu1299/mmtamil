"use client"
import React, { createContext, useEffect, useState } from 'react'

import PaidFeatures from '@/app/_components/paid-features/paid-features'
import NewsFeed from './_componets/news-feed'
import { allPosts } from './api/api'
import { PostResponse } from './type'
import { Skeleton } from '@/components/ui/skeleton'

interface Prop {
  reload: boolean,
  setReload: React.Dispatch<React.SetStateAction<boolean>>,
  currentPage:number,
  setCurrentPage : React.Dispatch<React.SetStateAction<number>>,
  totalPages:number
}

export const CreateCont = createContext<Prop | null>(null)
const Main = () => {
  const [data, setData] = useState<PostResponse[]>()
  const [reload, setReload] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const fetch = async (currentPage:number) => {
    const response = await allPosts(currentPage);
    console.log("Response in the news-feed", response?.data.data);
    setData(response?.data.data.data)
    setTotalPages(response?.data.data.totalPages)
  }

  useEffect(() => {
    fetch(currentPage)
  }, [])

  useEffect(() => {
    fetch(currentPage);
  }, [reload, setReload,currentPage])

  return (
    <CreateCont.Provider value={{ reload, setReload, currentPage, setCurrentPage, totalPages}}>
      <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] lg:py-4  mx-auto">

        <div className="flex justify-between items-start w-full ">
          <div className="w-full flex flex-col lg:mr-4">
            {
              data ?
                <NewsFeed data={data} reload={reload} setReload={setReload} />
                :
                <div className='flex flex-col w-full items-center justify-center gap-4 mt-4'>
                  {[1, 2, 3].map((_, index) =>
                  (<div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[412px] w-[450px] rounded-xl" />
                  </div>))}
                </div>
            }
          </div>
          <div className="hidden  xl:block min-w-[312px] w-[312px]">
            <PaidFeatures />
          </div>
        </div>
      </div>
    </CreateCont.Provider>

  )
}

export default Main