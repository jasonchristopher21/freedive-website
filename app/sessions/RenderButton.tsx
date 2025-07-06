import type { SessionBoxProps } from "./SessionBox";
import { useAppSelector } from "@/redux/store";

const RenderButton = ({
  props,
  onClick,
}: {
  props: SessionBoxProps;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const user = useAppSelector((state) => state.user.user);
  const userId = user?.id || "";

  // If user already signed up for the session
  if (
    props.Signup &&
    props.Signup.length > 0 &&
    userId &&
    props.Signup.some((signup) => signup.userId === userId)
  ) {
    return (
      <button
        disabled
        className="mt-3 font-heading text-white bg-green-500 text-white rounded-md font-bold text-[16px] py-1.5"
      >
        CONFIRMED
      </button>
    );
  }

  // If session is full
  if (props.Signup && props.Signup.length >= props.maxParticipants) {
    return (
      <button
        disabled
        className="mt-3 font-heading text-white bg-grey-300 text-white rounded-md font-bold text-[16px] py-1.5"
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
        className="mt-3 font-heading text-white bg-grey-300 text-white rounded-md font-bold text-[16px] py-1.5"
      >
        LOCKED
      </button>
    );
  }

  return (
    <button
      className="mt-3 font-heading text-white bg-blue-500 text-white rounded-md font-bold text-[16px] py-1.5"
      onClick={onClick}
    >
      SIGN UP
    </button>
  );
};

export default RenderButton;