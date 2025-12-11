import React, { SetStateAction, useState } from "react";
import styles from "../styles";
import clsx from "clsx";

export type EditModalProps = {
    confirm: () => Promise<void>,
    cancel: () => void
}

export default function ConfirmEditModal({ confirm, cancel }: EditModalProps) {
    const [loading, setLoading] = useState<boolean>(false)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-blue-500 rounded-lg shadow-lg w-5/6 md:w-1/2 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto -mt-2">
                <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto mt-2">
                    <div className="flex flex-col gap-2">
                        <h1 className={styles.heading1}>EDIT CONFIRMATION</h1>
                        <p className="text-[16px] text-grey-500">
                            Are you sure you want commit the change?
                        </p>
                    </div>
                    {/* Mobile View */}
                    <div className="flex flex-col md:hidden gap-2 mt-1">
                        <button
                            className={clsx(
                                "font-heading text-white bg-blue-500 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto hover:bg-opacity-80 transition duration-200",
                                loading ? "cursor-not-allowed bg-grey-300" : "cursor-pointer"
                            )}
                            onClick={async () => {
                                setLoading(true)
                                await confirm()
                                setLoading(false)
                            }}
                        >
                            {loading ? "UPDATING..." : "CONFIRM"}
                        </button>

                        <button
                            className="font-heading text-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-grey-100 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
                            onClick={() => cancel()}
                        >
                            CANCEL
                        </button>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:flex flex-row gap-2 mt-2 w-2/3 mr-0 ml-auto">
                        <button
                            className="font-heading text-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-grey-100 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
                            onClick={() => cancel()}
                        >
                            CANCEL
                        </button>
                        <button
                            className={clsx(
                                "font-heading text-white bg-blue-500 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto hover:bg-opacity-80 transition duration-200",
                                loading ? "cursor-not-allowed bg-grey-300" : "cursor-pointer"
                            )}
                            onClick={async () => {
                                setLoading(true)
                                await confirm()
                                setLoading(false)
                            }}
                        >
                            {loading ? "UPDATING..." : "CONFIRM"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}