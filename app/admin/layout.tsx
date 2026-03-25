import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import AdminProtect from "@/components/AdminProtect"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtect>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-xs font-medium text-muted-foreground">Admin Panel</span>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pb-20">
            {children}
          </div>
          <footer className="sticky bottom-0 z-10 w-full p-6 text-center border-t border-slate-200/50 bg-white/70 backdrop-blur-xl transition-all duration-300 hover:bg-white/90">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500/80 selection:bg-indigo-100">
              Designed & Developed by
              <span className="block mt-2 text-slate-800 font-black tracking-[0.2em]">
                Nitish • Umang • Dhruvil • Dhara
              </span>
            </p>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </AdminProtect>
  )
}
