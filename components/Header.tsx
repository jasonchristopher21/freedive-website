import { Bars3Icon } from "@heroicons/react/24/outline";
import AuthButton from "./header-auth";

export default function Header() {
  return (
    <div className="sticky top-0 w-full bg-navy py-4 px-6 z-10">
      <div className="grid grid-cols-3 w-full max-w-screen-xl mx-auto bg-navy text-white">
        {/* <div className="flex justify-between bg-navy text-white max-w-screen-xl mx-auto"> */}
        <button>
          <Bars3Icon className="h-[24px] my-auto" />
        </button>
        <button className="font-heading font-bold text-[20px] m-auto">
          NUS FREEDIVING
        </button>
        <div className="mr-0 ml-auto">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
