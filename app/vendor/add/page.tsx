"use client";

import { useState, useRef } from 'react';
import { Input, Button, Tooltip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import BBoxAnnotator, { type EntryType } from '@/components/BBoxAnnotator';

export default function AddVendorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // --- States ---
  const [extractedRows, setExtractedRows] = useState<Array<{ invoiceNo: string, dueDate: string, dueAmount: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [extraction, setExtraction] = useState({
    invoiceNo: '',
    dueDate: '',
    dueAmount: '',
  });

  const [entries, setEntries] = useState<EntryType[]>([]);
  const [resetKey, setResetKey] = useState(0); // For forcing re-render

  // Default Image (Initial State)
  const [imageUrl, setImageUrl] = useState("/assets/images/sample_soa_1.png");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const labels = ['Invoice No', 'Due Date', 'Due Amount'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Vendor added:', formData);
    console.log('Final Data:', extractedRows);
  };

  // --- 1. Handle Clear All ---
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear the entire form?")) {
      setFormData({ name: '', email: '', phone: '' });
      setEntries([]);
      setExtractedRows([]);
      setExtraction({ invoiceNo: '', dueDate: '', dueAmount: '' });


      setResetKey(prev => prev + 1); // Force redraw of canvas
    }
  };

  // --- 2. Handle File Upload ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch('http://127.0.0.1:8000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        // Backend returns: { filePath: "/uploads/filename.png" }
        setImageUrl(data.filePath);

        // Reset old data for new image
        setEntries([]);
        setExtractedRows([]);
        setResetKey(prev => prev + 1);

      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload image. Ensure backend is running.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  // --- 3. Handle Generation ---
  const handleGenerateAnnotations = async () => {
    if (entries.length === 0) {
      alert("Please draw boxes on one example row first.");
      return;
    }

    setIsGenerating(true);
    setExtractedRows([]);

    try {
      const response = await fetch('http://127.0.0.1:8000/extract-soa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imagePath: imageUrl, // Use the current dynamic image
          userBoxes: entries,
          fieldPrompts: {
            invoiceNo: extraction.invoiceNo,
            dueDate: extraction.dueDate,
            dueAmount: extraction.dueAmount
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.rows && data.rows.length > 0) {
        setExtractedRows(data.rows);
      } else {
        alert("No rows found. Try adjusting your boxes.");
      }

    } catch (error) {
      console.error("Error generating annotations:", error);
      alert(`Failed to extract data: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

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

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Import Button */}
            <Tooltip content="Upload a new Statement of Account image">
              <Button
                size="sm"
                color="primary"
                endContent={<ArrowUpTrayIcon className="h-4 w-4 mr-1" />}
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
              >
                {isUploading ? "Uploading..." : "Import SOA"}
              </Button>
            </Tooltip>

            {/* Clear Button */}
            <Tooltip content="Clears the entire form and resets all data">
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onClick={handleClearAll}
                startContent={<TrashIcon className="h-4 w-4" />}
              >
                Clear All
              </Button>
            </Tooltip>

            {/* Generate Button */}
            <Tooltip content="Generate Table using AI">
              <Button
                size="sm"
                color="secondary"
                onClick={handleGenerateAnnotations}
                isLoading={isGenerating}
              >
                {isGenerating ? "AI Processing..." : "Generate Annotations"}
              </Button>
            </Tooltip>
          </div>

          <div className="flex justify-center border">
            {/* key={resetKey} ensures component destroys & recreates on clear/upload */}
            <div style={{ width: '100%' }} key={resetKey}>
              <BBoxAnnotator
                url={imageUrl}
                inputMethod="select"
                labels={labels}
                onChange={(e) => setEntries(e)}
              />
            </div>
          </div>
          <br />

          <h1 className="font-bold">Extraction Logic (Natural Language Prompt)</h1>
          <p className="text-sm text-gray-500 mb-4">Add specific rules for data transformation if needed.</p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">Invoice No Logic</label>
              <textarea
                value={extraction.invoiceNo}
                onChange={(e) => setExtraction({ ...extraction, invoiceNo: e.target.value })}
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">Due Date Logic</label>
              <textarea
                value={extraction.dueDate}
                onChange={(e) => setExtraction({ ...extraction, dueDate: e.target.value })}
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">Due Amount Logic</label>
              <textarea
                value={extraction.dueAmount}
                onChange={(e) => setExtraction({ ...extraction, dueAmount: e.target.value })}
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-default-600 mb-1">Box Payload (Debug)</label>
              <textarea
                value={JSON.stringify(entries, null, 2)}
                readOnly
                className="w-full rounded-md border px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-default-50"
                rows={4}
              />
            </div>
          </div>

          {extractedRows.length > 0 && (
            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
              <h2 className="font-bold text-lg mb-4 text-green-700">
                AI Extracted & Transformed Data ({extractedRows.length} rows)
              </h2>
              <Table aria-label="Extracted SOA Data" className="h-auto min-w-full">
                <TableHeader>
                  <TableColumn>INVOICE NO</TableColumn>
                  <TableColumn>DUE DATE</TableColumn>
                  <TableColumn>AMOUNT</TableColumn>
                </TableHeader>
                <TableBody>
                  {extractedRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.invoiceNo}</TableCell>
                      <TableCell>{row.dueDate}</TableCell>
                      <TableCell>{row.dueAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

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