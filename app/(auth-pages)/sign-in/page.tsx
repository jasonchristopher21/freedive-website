import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="h-full">
      {/* <iframe
      className="bg-video"
      src="https://www.youtube.com/embed/8U_nLVItqdw?autoplay=1&mute=1&controls=0&loop=1&start=1&end=13&playlist=8U_nLVItqdw"
      frameBorder="0"
      allowFullScreen
      allow="autoplay"
    /> */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mx-auto max-w-md md:min-w-[400px] my-auto">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link
                className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium"
                href="/sign-up"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <button
              type="button"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg
                className="w-4 h-auto"
                width="46"
                height="47"
                viewBox="0 0 46 47"
                fill="none"
              >
                <path
                  d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                  fill="#4285F4"
                />
                <path
                  d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                  fill="#34A853"
                />
                <path
                  d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                  fill="#FBBC05"
                />
                <path
                  d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                  fill="#EB4335"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6">
              Or
            </div>

            {/* Form */}
            <form>
              <div className="grid gap-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none border-2 "
                    required
                    aria-describedby="email-error"
                  />
                  <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                    Please include a valid email address so we can get back to you
                  </p>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm mb-2">
                      Password
                    </label>
                    <Link
                      className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium mb-2"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none border-2"
                    required
                    aria-describedby="password-error"
                  />
                  <p className="hidden text-xs text-red-600 mt-2" id="password-error">
                    8+ characters required
                  </p>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="text-sm ms-3">
                    Remember me
                  </label>
                </div>

                {/* Form Message */}
                <FormMessage message={searchParams} />

                {/* Submit Button */}
                <SubmitButton pendingText="Signing In..." className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" formAction={signInAction}>
                  Sign in
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    // <form className="flex-1 flex flex-col min-w-64">
    //   <h1 className="text-2xl font-medium">Sign in</h1>
    //   <p className="text-sm text-foreground">
    //     Don't have an account?{" "}
    //     <Link className="text-foreground font-medium underline" href="/sign-up">
    //       Sign up
    //     </Link>
    //   </p>
    //   <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
    //     <Label htmlFor="email">Email</Label>
    //     <Input name="email" placeholder="you@example.com" required />
    //     <div className="flex justify-between items-center">
    //       <Label htmlFor="password">Password</Label>
    //       <Link
    //         className="text-xs text-foreground underline"
    //         href="/forgot-password"
    //       >
    //         Forgot Password?
    //       </Link>
    //     </div>
    //     <Input
    //       type="password"
    //       name="password"
    //       placeholder="Your password"
    //       required
    //     />
    // <SubmitButton pendingText="Signing In..." formAction={signInAction}>
    //   Sign in
    // </SubmitButton>
    // <FormMessage message={searchParams} />
    //   </div>
    // </form>
  );
}
