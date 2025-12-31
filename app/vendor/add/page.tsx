"use client";

import { useState } from 'react';
import { Input, Button, Tooltip } from "@heroui/react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import BBoxAnnotator, { type EntryType } from '@/components/BBoxAnnotator';


export default function AddVendorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Extraction fields for SOA mapping
  const [extraction, setExtraction] = useState({
    invoiceNo: '',
    dueDate: '',
    dueAmount: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Vendor added:', formData);
    // Here you can add logic to save to backend or state
  };

  const handleSOASubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Vendor added:', formData);
    // Here you can add logic to save to backend or state
  };

  const labels = ['Invoice No', 'Due Date', 'Due Amount'];
  const [entries, setEntries] = useState<EntryType[]>([]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">New Vendor</h1>
      </div>
      <div className="flex items-center justify-center min-h-full">
        <form onSubmit={handleSubmit} className="w-full p-8 bg-white rounded-lg shadow-lg">
          <h1 className="font-bold">Basic Details</h1>
          <br />
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Input
              label="Vendor Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              size="lg"
            />
            <Input
              label="Contact Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              size="lg"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              size="lg"
            />
          </div>
          <hr />
          <br />
          <h1 className="font-bold">SOA Mapping</h1>
          <br />
          <div className="flex justify-left mb-4 gap-4">
            <Tooltip content="Import Statement of Account sample in image or PDF format">
              <Button size="sm" color="primary" endContent={<ArrowUpTrayIcon className="h-4 w-4 mr-1" />}>
                Import SOA
              </Button>
            </Tooltip>
            <Tooltip content="Clears all existing annotations">
              <Button size="sm" color="primary">
                Clear
              </Button>
            </Tooltip>
            <Tooltip content="Generate Annotations using AI">
              <Button size="sm" color="primary">
                Generate Annotations
              </Button>
            </Tooltip>
          </div>
          <div className="flex justify-center border">
            <div style={{ width: '100%' }}>
              <BBoxAnnotator
                url="/assets/images/sample_soa_1.png"
                inputMethod="select"
                labels={labels}
                onChange={(e) => setEntries(e)}
              />
            </div>
          </div>
          <br />
          <h1 className="font-bold">Extraction logic (Natural Language Prompt)</h1>
          <br />
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">Invoice No</label>
              <textarea
                value={extraction.invoiceNo}
                onChange={(e) => setExtraction({ ...extraction, invoiceNo: e.target.value })}
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">Due Date</label>
              <textarea
                value={extraction.dueDate}
                onChange={(e) => setExtraction({ ...extraction, dueDate: e.target.value })}
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">Due Amount</label>
              <textarea
                value={extraction.dueAmount}
                onChange={(e) => setExtraction({ ...extraction, dueAmount: e.target.value })}
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">SOA Mapping</label>
              <textarea
                value={JSON.stringify(entries, null, 2)}
                readOnly
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-default-50"
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-center mb-4 gap-4">
            <Button type="submit" color="primary">
              Add Vendor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}