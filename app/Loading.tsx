import cwt from "@/app/assets/img/CWT.svg"

export default function Loading() {
  return (
    <div className="flex flex-row justify-center items-center p-4 gap-4">
      <h1 className="flex h-full font-bold text-2xl">LOADING...</h1>
      <object type="image/svg+xml" data={cwt.src} className="h-[60vh] w-[48vh] rotate-180"></object>
    </div>
  )
}
