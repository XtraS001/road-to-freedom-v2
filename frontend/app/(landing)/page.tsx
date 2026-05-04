import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">
        Welcome to your new Next.js project!
      </h1>
      {/*  Display env variables NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL} */}
      {/* <div>
        <p>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL}</p>
      </div> */}
    </div>
  );
}
