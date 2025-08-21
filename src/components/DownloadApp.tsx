'use client'

import Image from "next/image"
import Link from "next/link"
import logo from "@/../public/logo.png";
import { useEffect, useState } from "react";
function DownloadApp() {
    const [open,setOpen]=useState(false);
    useEffect(()=>{
        setTimeout(()=>{
setOpen(true);
        },3000)
    },[])
  return (
    <>  
    {open&&<div className="bg-gradient-to-br from-emerald-600 to-emerald-800 px-4 py-1 flex items-center justify-between">
{/* left side logo and  */}
<div className="flex items-center gap-6">
  <div className="size-[5px]"></div>
  <Image
    src={logo}
    className="w-[89.98px] h-[28.08px] object-contain"
    alt="logo" />
    <div className="">
      <h3 className="text-[#F2DB40] font-semibold tracking-tight lg:text-lg">App up to $18</h3>
      <div className="flex items-center gap-[2px]">
        {[1,2,3,4,5].map(i=>(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-[#FFD600]">
  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
</svg>

        ))}
      </div>
    </div>
</div>
{/* left side logo and  */}
{/* right side download button  */}
<div className="relative mr-5">
  <Link href={'#'} className="flex items-center gap-2 lg:hover:scale-105 duration-150 bg-[#FFD600] font-bold text-yellow-700 px-3 py-2 rounded-lg text-sm tracking-tight shadow-md shadow-emerald-950/30">
  Download
  </Link>
  <button
  onClick={()=>setOpen(false)}
  className="absolute -top-[8px] -right-[36px] ">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7  text-white/90 hover:scale-105 duration-200 shadow shadow-emerald-950/30 rounded-full ">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
</svg>

  </button>
</div>
{/* right side download button  */}
    </div>}
    </>
  )
}

export default DownloadApp