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
          <footer className="sticky bottom-0 z-10 w-full py-5 px-4 text-center border-t border-slate-100 bg-white/70 backdrop-blur-xl transition-all">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 flex items-center justify-center gap-2">
                🚀 Interns 2026 <span className="text-slate-300">|</span> Nitish • Umang • Dhruvil • Dhara
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500/80 flex items-center justify-center gap-1.5">
                Guided by
                <span className="text-amber-500 font-black underline decoration-amber-200 underline-offset-4">
                  Vihang
                </span> ✨
              </p>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </AdminProtect>
  )
}
