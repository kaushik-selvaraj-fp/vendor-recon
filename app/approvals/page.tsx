"use client";

import Link from 'next/link';
import { Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function ApprovalListPage() {
  // Sample approvals data for demonstration
  const approvals = [
    { id: 1, approvalId: 'APR-1001', type: 'Credit', note: 'Credit request for invoice #123' },
    { id: 2, approvalId: 'APR-1002', type: 'Debit', note: 'Debit request adjustment for PO-456' },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Approvals</h1>
      </div>
      {approvals.length === 0 ? (
        <p className="text-center">No approvals yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableColumn>Approval ID</TableColumn>
            <TableColumn>Type</TableColumn>
            <TableColumn>Note</TableColumn>
            <TableColumn>Detail</TableColumn>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>{approval.approvalId}</TableCell>
                <TableCell>{approval.type}</TableCell>
                <TableCell>{approval.note}</TableCell>
                <TableCell>
                  <Link href={`/approvals/${approval.id}`} className="inline-block">
                    <Button isIconOnly size="sm" variant="light" aria-label={`View approval ${approval.approvalId}`}>
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}