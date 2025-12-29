"use client";

import Link from 'next/link';
import { Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";

export default function VendorListPage() {
  // Sample vendor data for demonstration
  const vendors = [
    { id: 1, name: 'Vendor A', email: 'vendorA@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Vendor B', email: 'vendorB@example.com', phone: '098-765-4321' },
  ];

  return (
    <div className="container mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Vendors</h1>
        <Link href="/vendor/add">
          <Button color="primary">
            Add Vendor
          </Button>
        </Link>
      </div>

      {vendors.length === 0 ? (
        <p className="text-center">No vendors yet. Click "Add Vendor" to get started.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Phone</TableColumn>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}