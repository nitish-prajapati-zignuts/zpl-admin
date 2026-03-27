import AdminProtect from "@/components/AdminProtect";

export default function EditPlayerGradesLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProtect>
            <div>
                {children}  
            </div>

        </AdminProtect>
    )
}