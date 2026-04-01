"use client"
import PaidFeatures from '@/app/_components/paid-features/paid-features';
import React from 'react';
import MessageInbox from './_components/message-inbox';
import InboxFilter from './_components/inbox-filter';

const ChartPage = () => {
  return (
    <div className="max-w-[1560px] min-h-screen w-full lg:w-[90%] mx-auto lg:py-6">
      <div className="mb-4 px-4 lg:px-0">
        <h1 className="font-playfair text-[28px] font-semibold text-maroon">
          Messages
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          Connect and chat with your matches
        </p>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="sm:w-[295px] lg:w-[295px]">
            <InboxFilter />8
          </div>
          <div className="flex-1 min-w-0">
            <MessageInbox />
          </div>
        </div>

        <div className="hidden xl:block min-w-[312px] w-[312px] flex-shrink-0">
          <PaidFeatures />
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
