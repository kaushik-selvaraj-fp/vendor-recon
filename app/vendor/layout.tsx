import { Sidebar } from "@/components/Sidebar";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}