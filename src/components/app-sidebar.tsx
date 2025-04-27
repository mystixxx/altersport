import * as React from "react";
import {
  GalleryVerticalEnd,
  HomeIcon,
  TrophyIcon,
  ShieldHalfIcon,
  UsersIcon,
  ChevronRightIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          title: "Naslovna",
          url: "#",
          icon: <HomeIcon size={24} />,
        },
        {
          title: "Lige",
          url: "/leagues",
          icon: <TrophyIcon size={24} />,
        },
        {
          title: "Utakmice",
          url: "/games",
          icon: <ShieldHalfIcon size={24} />,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-4">
        <Link href="/home">
          <h1 className="mt-6 text-2xl font-bold text-white">ALTERSPORT</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-5">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.url === "/leagues"}
                    >
                      <a href={item.url}>
                        {item.icon}
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col">
          <button className="flex cursor-pointer items-center gap-2 p-2">
            <SettingsIcon className="size-6" color="white" />
            <p className="text-text-whiteish text-base">Postavke</p>
          </button>
          <Separator className="my-1.5 bg-[#464D57]" />
          <div className="flex items-center justify-between gap-2 px-2 pb-5">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>IP</AvatarFallback>
              </Avatar>
              <div className="text-text-whiteish">
                <p className="text-sm font-semibold">Ilija Popović</p>
                <p className="text-xs">ilija.popovic@gmail.com</p>
              </div>
            </div>
            <ChevronRightIcon
              className="size-4 cursor-pointer"
              color="#F8F5F9"
            />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
