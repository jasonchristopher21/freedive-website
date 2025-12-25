import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { CrossIcon } from "lucide-react";
// import { toast, Bounce } from "react-toastify"
import styles from "@/app/styles";

const SignupConfirmedModal = ({ closeFn }: { closeFn: () => void }) => {
  const [errorMessage, setErrorMessage] = useState<string>();

  const router = useRouter();

  console.log("reached");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-green-500 rounded-lg shadow-lg w-5/6 md:w-1/2 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto -mt-2">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto mt-2">
          <div className="flex flex-col gap-2">
            <h1 className={styles.heading1}>SIGN UP CONFIRMED</h1>
            <p className="text-[16px] text-grey-500">
              Your sign up for the session has been confirmed successfully!
            </p>
            <p className="text-[16px] text-grey-500 md:-mt-1">
              If you wish to withdraw your sign up, please contact the session
              organizer.
            </p>
          </div>

          {/* Mobile View */}
          <div className="flex flex-col md:hidden gap-2 mt-1">
            <button
              className="font-heading text-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-grey-100 hover:border-green-500 hover:text-green-500 transition-colors duration-200"
              onClick={closeFn}
            >
              BACK
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex flex-row gap-2 mt-2 w-full mr-0 ml-auto">
            <button
              className="font-heading text-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-grey-100 hover:border-green-500 hover:text-green-500 transition-colors duration-200"
              onClick={closeFn}
            >
              BACK 
            </button>
          </div>

          {errorMessage ? (
            <div className="bg-red-300 bg-opacity-25 rounded-lg p-4 mt-2">
              <p className="text-[14px] text-red-500">Error: {errorMessage}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SignupConfirmedModal;
