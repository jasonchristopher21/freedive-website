"use client"

import {
	type LucideIcon,
} from "lucide-react"

import { useRouter } from "next/navigation"

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function NavItem({
	items,
	title,
}: {
	items: {
		name: string
		url: string
		icon: LucideIcon | React.ForwardRefExoticComponent<React.RefAttributes<HTMLSpanElement>>
	}[],
	title: string,
}) {
	const router = useRouter();
	const { setOpenMobile } = useSidebar();
	return (
		<SidebarGroup>
			<SidebarGroupLabel>{title}</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.name}
						asChild
						defaultOpen={true}
						className="group/collapsible"
					>
						<SidebarMenuItem key={item.name}>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.name} onClick={() => { router.push(item.url); setOpenMobile(false); }}>
									{item.icon && <item.icon />}
									<span>{item.name}</span>
								</SidebarMenuButton>
							</CollapsibleTrigger>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	)
}
