/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
const Power = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 52 52"
    enableBackground="new 0 0 52 52"
    xmlSpace="preserve"
    {...props}
  >
    <defs>
      <linearGradient id="tailwind-gradient" x1={0} y1={0} x2={1} y2={0}>
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <g fill="url(#tailwind-gradient)">
      <path d="M34.4,7.7C33.7,7.4,33,7.9,33,8.6v3.8c0,0.7,0.4,1.4,1,1.7c5.3,3,8.7,9,7.9,15.7       c-0.8,7.3-6.7,13.3-14.1,14.1C18.2,45,10,37.4,10,28c0-5.9,3.2-11.1,8-13.9c0.6-0.3,1-1,1-1.7V8.6c0-0.7-0.7-1.2-1.4-0.9       C9.1,11.2,3.2,20,4.1,30C5,40.3,13.2,48.7,23.5,49.9C36.7,51.3,48,41,48,28C48,18.8,42.4,11,34.4,7.7z" />
      <path d="M29,3.5C29,2.7,28.3,2,27.5,2h-3C23.7,2,23,2.7,23,3.5v17c0,0.8,0.7,1.5,1.5,1.5h3c0.8,0,1.5-0.7,1.5-1.5       V3.5z" />
    </g>
  </svg>
);
export default Power;
