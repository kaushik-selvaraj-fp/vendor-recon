"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { Tabs, Tab, Card, CardBody, Tooltip } from "@heroui/react";

// params may be a Promise in some Next.js versions, allow both shapes
type Props = { params: { id: string } | Promise<{ id: string }> };

export default function ApprovalDetailPage({ params }: Props) {
    const approvals = [
        { id: 1, approvalId: 'APR-1001', type: 'Credit', note: 'Credit request for invoice #123', amount: '$1,200.00', status: 'Pending' },
        { id: 2, approvalId: 'APR-1002', type: 'Debit', note: 'Debit request adjustment for PO-456', amount: '$400.00', status: 'Pending' },
    ];

    // Ledger state & CSV loading
    type LedgerRow = Record<string, string>;
    const [ledger, setLedger] = useState<LedgerRow[]>([]);
    const [loading, setLoading] = useState(true);
    const columns = ['SE PC', 'SE Invoice #', 'SE FI Doc', 'SE PO Number', 'SE Doc Date', 'SE Amount', 'Supplier Invoice #', 'PO Number', 'Supplier Doc Date', 'Supplier Amount', 'Difference'];
    // UI tab state — first tab is 'ledger'
    const [activeTab, setActiveTab] = useState<'ledger' | 'vendor' | 'differences'>('ledger');

    useEffect(() => {
        let mounted = true;
        fetch('/data/ledger.csv')
            .then((res) => res.text())
            .then((text) => {
                if (!mounted) return;
                const parsed = parseCSV(text);
                setLedger(parsed);
            })
            .catch((err) => console.error('Failed to load ledger CSV', err))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    function parseCSV(text: string): LedgerRow[] {
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length <= 1) return [];
        // expected header indices based on CSV: 
        // 0:SE PC,1:SE Invoice #,2: (empty),3:SE FI Doc,4:SE PO Number,5:SE Doc Date,6:SE Amount,7:Supplier Invoice #,8:PO Number,9:Supplier Doc Date,10:Supplier Amount,11:Difference
        const colIndices = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        return lines.slice(1).map((line) => {
            const parts = line.split(',').map(p => p.trim());
            const obj: LedgerRow = {};
            columns.forEach((col, i) => {
                const idx = colIndices[i];
                obj[col] = parts[idx] ?? '';
            });
            return obj;
        });
    }

    // Unwrap params if it's a Promise using React.use(), otherwise use it directly
    // @ts-ignore - React.use may be an experimental API depending on React version
    const resolvedParams = (React as any).use ? (React as any).use(params) : params;
    const id = (resolvedParams as any)?.id ?? (params as any)?.id;
    const approval = approvals.find((a) => String(a.id) === String(id));

    if (!approval) {
        return (
            <div className="container mx-auto mt-10">
                <p className="text-center">Approval not found.</p>
                <div className="mt-4 text-center">
                    <Link href="/approvals">
                        <Button variant="light" size="sm">Back to approvals</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Approval Details</h1>
                <Link href="/approvals">
                    <Button isIconOnly size="sm" aria-label="Back to approvals">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg shadow p-6 space-y-4">
                <div>
                    <h3 className="text-sm text-black text-default-500">Approval ID</h3>
                    <p className="font-medium text-black">{approval.approvalId}</p>
                </div>
                <div>
                    <h3 className="text-sm text-black text-default-500">Type</h3>
                    <p className="font-medium text-black">{approval.type}</p>
                </div>
                <div>
                    <h3 className="text-sm text-black text-default-500">Note</h3>
                    <p className="font-medium text-black">{approval.note}</p>
                </div>
                <div>
                    <h3 className="text-sm text-black text-default-500">Amount</h3>
                    <p className="font-medium text-black">{approval.amount}</p>
                </div>
                <div>
                    <h3 className="text-sm text-black text-default-500">Status</h3>
                    <p className="font-medium text-black">{approval.status}</p>
                </div>
            </div>

            <div className="mt-8">
                <Tabs aria-label="Tabs variants" variant="underlined">
                    <Tab key="ledger" title="ledger">
                        <Card>
                            <CardBody>
                                <>
                                    <h2 className="text-xl font-semibold mb-4 text-black">Ledger Entries</h2>
                                    {loading ? (
                                        <p>Loading ledger…</p>
                                    ) : ledger.length === 0 ? (
                                        <p>No ledger entries found.</p>
                                    ) : (
                                        <div className="overflow-x-auto rounded-lg border">
                                            <table className="min-w-full divide-y">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        {columns.map((col) => (
                                                            <th key={col} className="px-3 py-2 text-left text-sm font-medium text-gray-700">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y">
                                                    {ledger.map((row, idx) => (
                                                        <tr key={idx}>
                                                            {columns.map((col) => (
                                                                <td key={col} className="px-3 py-2 text-sm text-gray-900 whitespace-nowrap">{row[col]}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="vendor_recon" title="Vendor Recon">
                        <Card>
                            <CardBody>
                                <br />
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="differences" title="Differences">
                        <Card>
                            <CardBody>
                                <br />
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>
            <div className="flex justify-left mb-4 gap-4">
                <Tooltip content="Approve the request to update the ledger">
                    <Button size="sm" color="primary">
                        Approve
                    </Button>
                </Tooltip>
                <Tooltip content="Reject the request to update the ledger">
                    <Button size="sm" color="primary">
                        Reject
                    </Button>
                </Tooltip>
                <Tooltip content="Request clarification for the approval">
                    <Button size="sm" color="primary">
                        Request Clarification
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}
