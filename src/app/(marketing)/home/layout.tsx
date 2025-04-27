import { AppSidebarLanding } from "@/components/app-sidebar-landing";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebarLanding viewType="sport" />
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#070314] to-[#14103d] px-8 py-3">
        <div className="flex items-center md:invisible">
          <SidebarTrigger className="bg-transparent text-white" />
        </div>

        {children}
      </div>
    </SidebarProvider>
  );
}
