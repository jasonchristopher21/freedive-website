import { SessionDetailedResponseMapped } from "@/app/api/sessions/[id]/route";
import { Breadcrumb, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import BreadcrumbItem from "antd/es/breadcrumb/BreadcrumbItem";
import { useRouter } from "next/navigation";

export default function SessionHeader({ name }: Pick<SessionDetailedResponseMapped,"name"> ) {
  const router = useRouter()
  return (
    <header className="sticky flex mt-8 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2 px-4">
        {/** Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem separator={<BreadcrumbSeparator />}>
              <BreadcrumbLink onClick={() => router.back()}>Sessions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem separator="">
              <BreadcrumbPage>{name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}