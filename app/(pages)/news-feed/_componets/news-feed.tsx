import React from 'react'
import NewsFeedNav from './news-feednav'
import { PostResponse } from '../type'


const NewsFeed = ({ data , reload,setReload}: { data: PostResponse[], reload:boolean, setReload:React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div>
      
      <NewsFeedNav reload={reload} setReload={setReload} data={data} />
    </div>
  )
}


export default NewsFeed
