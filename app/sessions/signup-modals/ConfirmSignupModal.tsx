import { useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { CrossIcon } from "lucide-react";
// import { toast, Bounce } from "react-toastify"
import styles from "@/app/styles";
import clsx from "clsx";
import dayjs from "dayjs";

const handleSignup = async (sessionId: string, userId: string) => {
  await fetch("/api/sessions/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionId,
      userId: userId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        return response.json().then((data) => {
          throw new Error(data.error || "Something went wrong");
        });
      }
    })
    .catch((error) => {
      console.error("Error during signup:", error);
      alert(error.message);
    });
};

const ConfirmSignupModal = ({
  closeFn,
  sessionDate,
  sessionId,
  userId,
}: {
  closeFn: () => void;
  sessionDate: Date;
  sessionId: string;
  userId: string;
}) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-blue-500 rounded-lg shadow-lg w-5/6 md:w-1/2 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto -mt-2">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-y-4 max-h-[60vh] overflow-y-auto mt-2">
          <div className="flex flex-col gap-2">
            <h1 className={styles.heading1}>SIGN UP CONFIRMATION</h1>
            <p className="text-[16px] text-grey-500">
              Are you sure you want to sign up for the session on {dayjs(sessionDate).format("dddd, D MMMM YYYY")}?
            </p>
          </div>

          {/* Mobile View */}
          <div className="flex flex-col md:hidden gap-2 mt-1">
            <button
              className={clsx(
                "font-heading text-white bg-blue-500 text-white rounded-md font-bold text-[16px] py-1.5 w-full mx-auto hover:bg-opacity-80 transition duration-200",
                loading ? "cursor-not-allowed bg-grey-300" : "cursor-pointer"
              )}
              onClick={() => {
                setLoading(true);
                handleSignup(sessionId, userId);
              }}
            >
              {loading ? "SIGNING UP..." : "CONFIRM SIGN UP"}
            </button>

            <button
              className="font-heading text-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-grey-100 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
              onClick={closeFn}
            >
              CANCEL
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex flex-row gap-2 mt-2 w-2/3 mr-0 ml-auto">
            <button
              className="font-heading text-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto border border-grey-100 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
              onClick={closeFn}
            >
              CANCEL
            </button>
            <button
              className={clsx(
                "font-heading text-white bg-blue-500 text-white rounded-md font-bold text-[16px] py-1.5 w-full mx-auto hover:bg-opacity-80 transition duration-200",
                loading ? "cursor-not-allowed bg-grey-300" : "cursor-pointer"
              )}
              onClick={() => {
                setLoading(true);
                handleSignup(sessionId, userId);
              }}
            >
              {loading ? "SIGNING UP..." : "CONFIRM SIGN UP"}
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

export default ConfirmSignupModal;
