"use client"

import styles from "@/app/styles"
import { closeError } from "@/redux/features/error/errorSlice"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { useEffect, useState } from "react"

export default function ErrorModal() {
  const { isError, message, response } = useAppSelector((state) => state.error)
  const dispatch = useAppDispatch()

  const [json, setJson] = useState("")

  useEffect(() => {
    const fn = async () => {
      if (isError && response) {
        setJson(JSON.stringify(await response.json()))
      }
    }
    fn()
  }, [isError])

  if (!isError) {
    return <></>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-red-500 rounded-lg shadow-lg w-5/6 md:w-1/2 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto -mt-2">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto mt-2">
          <div className="flex flex-col gap-2">
            <h1 className={styles.heading1}>AN ERROR OCCURED</h1>
            <p className="text-[16px] text-red-500">
              Something went wrong. If this is a big issue, please screenshot this page and contact the exco team.
            </p>
          </div>

          {/* Mobile View */}
          <div className="flex flex-col md:hidden gap-2 mt-1">
            <button
              className="font-heading text-red-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-red-300 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
              onClick={() => dispatch(closeError(null))}
            >
              CLOSE
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex flex-row gap-2 mt-2 w-full mr-0 ml-auto">
            <button
              className="font-heading text-red-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-red-300 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
              onClick={() => dispatch(closeError(null))}
            >
              CLOSE
            </button>
          </div>

          <div className="bg-red-300 bg-opacity-25 rounded-lg p-4 mt-2">
            <p className="text-[14px] text-red-500">
              Error: {message}
              {"\n"}
              {json}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
