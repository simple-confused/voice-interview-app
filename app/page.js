"use client";
import Image from "next/image";
import App from "./components/App";
import { useState } from "react";

export default function Home() {
  const [start, setStart] = useState(false);
  const handleStart = () => {
    setStart(!start);
  };
  return !start ? (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold text-center text-gray-800">
        Machine Learning Interview Questions For Mock Interview
      </h1>
      <img
        src="ml.jpg"
        alt="Machine Learning"
        width={400}
        height={400}
        className="rounded-md"
      />
      <p onClick={handleStart} className="cursor-pointer text-xl text-red-600">
        Click Here To Start
      </p>
    </div>
  ) : (
    <>
      <App />
      <div
        onClick={handleStart}
        className="mt-6 px-4 py-2 text-center bg-yellow-500 text-gray-800 font-semibold rounded-md hover:bg-yellow-600 transition-colors duration-200 ease-in-out"
      >
        Stop
      </div>
    </>
  );
}
