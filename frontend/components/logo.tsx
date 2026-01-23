"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
      <h1
        // className=
        // "text-2xl font-bold bg-linear-to-r from-primary-4 to-primary-9 inline-block text-transparent bg-clip-text"
        // className="
        //   text-2xl
        //   font-bold
        //   bg-gradient
        //   from-primary-400
        //   to-primary-900
        //   text-clip
        //   bg-linear-to-r 
        //   from-blue-500 
        //   to-purple-700
        // "
        className ="bg-linear-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent text-2xl font-bold inline-block"
      >
        app.name
      </h1>
    </Link>
  );
}
