import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="min-h-screen w-full bg-[#ECEFED] px-[72px] pt-3 pb-[72px]">
        {children}
      </div>
    </SidebarProvider>
  );
}
