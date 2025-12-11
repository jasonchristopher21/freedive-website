import { useAppSelector } from "@/redux/store";
import { useState } from "react";
import ConfirmSignupModal from "./signup-modals/ConfirmSignupModal";
import SignupConfirmedModal from "./signup-modals/SignupConfirmedModal";
import { SessionDetailedResponseMapped } from "../api/sessions/[id]/route";

// Pick the smallest subset of attributes that we need.
type RenderButtonUser = Pick<SessionDetailedResponseMapped, 'id'|'levels'|'maxParticipants'|'date'|'startTime'|'endTime'>
  & { signups: Pick<SessionDetailedResponseMapped['signups'][0], 'id'>[] }

const RenderButton = ({ props }: { props: RenderButtonUser }) => {
  const user = useAppSelector((state) => state.user.user)!
  const userId = user.id

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignupConfirmedModal, setShowSignupConfirmedModal] = useState(false);

  // If date is past the session
  if (new Date() > new Date(props.date.slice(0, 10) + "T" + props.endTime)) {
    return (
      <>
        <button
          className="mt-3 font-heading text-white bg-gray-400 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto cursor-default"
          disabled
        >
          LOCKED
        </button>
      </>
    )
  }

  // If user already signed up for the session
  if (
    props.signups.some((signup) => signup.id === userId)
  ) {
    return (
      <>
        <button
          className="mt-3 font-heading text-white bg-green-500 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto cursor-default"
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
  if (props.signups.length >= props.maxParticipants) {
    return (
      <button
        disabled
        className="mt-3 font-heading text-white bg-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto"
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
        className="mt-3 font-heading text-white bg-grey-300 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto"
      >
        LOCKED
      </button>
    );
  }

  return (
    <>
      <button
        className="mt-3 font-heading text-white bg-blue-500 rounded-md font-bold text-[16px] py-1.5 w-full mx-auto"
        // onClick={(() => handleSignup(props.id, userId))}
        onClick={() => setShowConfirmModal(true)}
      >
        SIGN UP
      </button>
      {showConfirmModal && (
        <ConfirmSignupModal
          closeFn={() => setShowConfirmModal(false)}
          sessionDate={props.date}
          sessionId={props.id}
          userId={userId}
        />
      )}
    </>
  );
};

export default RenderButton;
