import type { SessionBoxProps } from "./SessionBox";
import { useAppSelector } from "@/redux/store";
import { useState } from "react";
import ConfirmSignupModal from "./signup-modals/ConfirmSignupModal";
import SignupConfirmedModal from "./signup-modals/SignupConfirmedModal";

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

const RenderButton = ({ props }: { props: SessionBoxProps }) => {
  const user = useAppSelector((state) => state.user.user);
  const userId = user?.id || "";

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignupConfirmedModal, setShowSignupConfirmedModal] =
    useState(false);

  // If user already signed up for the session
  if (
    props.Signup &&
    props.Signup.length > 0 &&
    userId &&
    props.Signup.some((signup) => signup.userId === userId)
  ) {
    return (
      <>
        <button
          className="mt-3 font-heading text-white bg-green-500 text-white rounded-md font-bold text-[16px] py-1.5 w-full mx-auto cursor-default"
          onClick={() => setShowSignupConfirmedModal(true)}
        >
          CONFIRMED
        </button>
        {showSignupConfirmedModal && (
          <SignupConfirmedModal
            closeFn={() => setShowSignupConfirmedModal(false)}
          />
        )}
      </>
    );
  }

  // If session is full
  if (props.Signup && props.Signup.length >= props.maxParticipants) {
    return (
      <button
        disabled
        className="mt-3 font-heading text-white bg-grey-300 text-white rounded-md font-bold text-[16px] py-1.5 w-full mx-auto"
      >
        FULL
      </button>
    );
  }

  // If user level is not suitable for the session
  if (
    props.levels.length > 0 &&
    user?.level &&
    !props.levels.includes(user.level)
  ) {
    return (
      <button
        disabled
        className="mt-3 font-heading text-white bg-grey-300 text-white rounded-md font-bold text-[16px] py-1.5 w-full mx-auto"
      >
        LOCKED
      </button>
    );
  }

  return (
    <>
      <button
        className="mt-3 font-heading text-white bg-blue-500 text-white rounded-md font-bold text-[16px] py-1.5 w-full mx-auto"
        // onClick={(() => handleSignup(props.id, userId))}
        onClick={() => setShowConfirmModal(true)}
      >
        SIGN UP
      </button>
      {showConfirmModal && (
        <ConfirmSignupModal closeFn={() => setShowConfirmModal(false)} />
      )}
    </>
  );
};

export default RenderButton;
