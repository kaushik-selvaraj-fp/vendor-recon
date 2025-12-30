"use client";

import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from "@heroui/react";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = () => {
  const router = useRouter();
  const navItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/" },
    { name: "Vendors", icon: UserGroupIcon, href: "/vendor" },
    { name: "Approvals", icon: ClipboardDocumentCheckIcon, href: "/approvals" },
    { name: "Schedule", icon: CalendarDaysIcon, href: "/schedule" },
    { name: "Formats", icon: DocumentTextIcon, href: "/format" },
  ];

  return (
    <Card className="w-64 h-screen rounded-none shadow-md">
      <CardBody className="p-0">
        <div className="p-4 text-lg font-bold border-b border-divider text-black">
          Menu
        </div>
        <div className="p-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              className="w-full justify-start mb-1 h-12"
              startContent={<item.icon className="h-5 w-5" />}
              variant="light"
              onClick={() => router.push(item.href)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};