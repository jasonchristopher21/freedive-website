import { Bars3Icon } from "@heroicons/react/24/outline";
import AuthButton from "./header-auth";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <div className="sticky top-0 w-full bg-navy py-4 px-4 z-10">
      <div className="flex justify-between md:grid md:grid-cols-3 w-full mx-auto bg-navy text-white">
        {/* <div className="flex justify-between bg-navy text-white max-w-screen-xl mx-auto"> */}
        <div className="flex justify-start m-auto md:ml-0">
          {/* <Bars3Icon className="h-[24px] my-auto" /> */}
          <SidebarTrigger />
        </div>
        <button className="font-heading font-bold text-[20px] m-auto">
          NUS FREEDIVING
        </button>
        <div className="flex justify-end m-auto md:mr-0">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
