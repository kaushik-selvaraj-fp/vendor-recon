"use client";

import { useState } from 'react';
import { Input, Button, Tooltip } from "@heroui/react";
import BBoxAnnotator, { type EntryType } from '@/components/BBoxAnnotator';

export default function AddVendorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
          <h1 className="font-bold text-black">Basic Details</h1>
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
              className="col-span-2"
            />
          </div>
          <br />
          <h1 className="font-bold text-black">SOA Mapping</h1>
          <div className="flex justify-center">
            <div style={{ width: '100%' }}>
              <BBoxAnnotator
                url="/assets/images/sample-soa.png"
                inputMethod="select"
                labels={labels}
                onChange={(e) => setEntries(e)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit" color="primary" size="lg" className="px-8">
              Add Vendor
            </Button>
          </div>
        </form>
      </div>
      <div className="flex items-center justify-center min-h-full">
        <h1 className="font-bold text-black">SOA Mapping</h1>
        <pre>{JSON.stringify(entries, null, 2)}</pre>
      </div>
      <br />
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