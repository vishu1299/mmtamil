import PaidFeatures from '@/app/_components/paid-features/paid-features'
import React from 'react'


import SettingsPage from './_components/settings'

const page = () => {
  return (
    <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] lg:py-6 mx-auto animate-fade-in">
    
    <div className="flex justify-between items-start w-full gap-4">
      <div className="w-full flex flex-col lg:mr-2">
   <SettingsPage/>
        </div>
      <div className="hidden  xl:block min-w-[312px] w-[312px]">
        <PaidFeatures />
      </div>
    </div>
  </div>
  )
}

export default page
