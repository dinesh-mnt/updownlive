"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Loader2, Calendar, Phone, Building, ExternalLink, Eye, X, Save } from 'lucide-react';
import { Card, CardContent } from "@/components/UI/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/UI/Table";
import { Button } from "@/components/UI/Button";

interface Enquiry {
  _id: string;
  department: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  message: string;
  notice?: string;
  createdAt: string;
}

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [noticeText, setNoticeText] = useState('');
  const [savingNotice, setSavingNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEnquiries = enquiries.filter(enq => 
    enq.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    enq.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    enq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (enq.companyName && enq.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    if (selectedEnquiry) {
      setNoticeText(selectedEnquiry.notice || '');
    }
  }, [selectedEnquiry]);

  const handleSaveNotice = async () => {
    if (!selectedEnquiry) return;
    setSavingNotice(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.patch(`${apiUrl}/enquiries/${selectedEnquiry._id}/notice`, { 
        notice: noticeText 
      }, { withCredentials: true });
      
      // Update local state to reflect the change
      setEnquiries(enquiries.map(enq => 
        enq._id === selectedEnquiry._id ? { ...enq, notice: noticeText } : enq
      ));
      setSelectedEnquiry({ ...selectedEnquiry, notice: noticeText });
    } catch (err) {
      console.error('Failed to save notice:', err);
      // Optional: add a toast notification for error
    } finally {
      setSavingNotice(false);
    }
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/enquiries`, {
        withCredentials: true
      });
      setEnquiries(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
      setError('Could not fetch enquiries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
        <span className="ml-2 text-brand-black font-semibold">Loading enquiries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-100 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-6 w-6 text-brand-blue" />
            Enquiry Detail
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View all contact form submissions and user enquiries.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search enquiries by name, email, or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full flex h-10 sm:w-80 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="text-sm font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 whitespace-nowrap">
            Total: {filteredEnquiries.length}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 border-gray-900 border">
          {filteredEnquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No enquiries found matching your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Details</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEnquiries.map((enq) => (
                    <TableRow key={enq._id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {enq.department}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enq.firstName} {enq.lastName}
                        </div>
                        {enq.companyName && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Building className="h-3 w-3" /> {enq.companyName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <a href={`mailto:${enq.email}`} className="text-sm text-brand-blue hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {enq.email}
                        </a>
                        {enq.phone && (
                          <a href={`tel:${enq.phone}`} className="text-xs text-gray-500 mt-1 hover:text-gray-900 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {enq.phone}
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 max-w-sm">
                        <div className="line-clamp-3" title={enq.message}>
                          {enq.message}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEnquiry(enq)}
                          className="text-brand-blue hover:text-blue-900 hover:bg-blue-50 gap-1.5"
                        >
                          <Eye className="w-4 h-4" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Detail Modal */}
      {selectedEnquiry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div 
            className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header (brand-black bg, white text) */}
            <div className="bg-[#111111] text-white p-5 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-400" />
                {selectedEnquiry.companyName || `${selectedEnquiry.firstName} ${selectedEnquiry.lastName}`}
              </h3>
              <button 
                onClick={() => setSelectedEnquiry(null)} 
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content (white bg, gray-700 text) - Scrollable area */}
            <div className="p-6 bg-white text-gray-700 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-8">
                
                {/* Left Column: Details */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</label>
                      <div className="font-medium text-gray-900 mt-1">{selectedEnquiry.firstName} {selectedEnquiry.lastName}</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</label>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedEnquiry.department}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                      <div className="font-medium mt-1 flex items-center gap-1.5 break-all">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <a href={`mailto:${selectedEnquiry.email}`} className="text-brand-blue hover:underline">
                          {selectedEnquiry.email}
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</label>
                      <div className="font-medium mt-1 flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        {selectedEnquiry.phone ? (
                          <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-gray-900">{selectedEnquiry.phone}</a>
                        ) : (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Calendar className="w-4 h-4" /> Date & Time Submitted
                    </label>
                    <div className="font-medium text-gray-900">
                      {new Date(selectedEnquiry.createdAt).toLocaleString(undefined, { 
                        dateStyle: 'full', 
                        timeStyle: 'short' 
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Message</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap leading-relaxed">
                      {selectedEnquiry.message}
                    </div>
                  </div>
                </div>

                {/* Right Column: Notice */}
                <div className="flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      Admin Notice / Notes
                    </label>
                    <Button
                      onClick={handleSaveNotice}
                      disabled={savingNotice || noticeText === selectedEnquiry.notice}
                      className="bg-brand-blue hover:bg-blue-700 text-white gap-2"
                      size="sm"
                    >
                      {savingNotice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Notice
                    </Button>
                  </div>
                  <textarea
                    value={noticeText}
                    onChange={(e) => setNoticeText(e.target.value)}
                    placeholder="Add internal notes, updates, or resolution details here..."
                    className="flex-1 w-full bg-white border border-gray-200 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none min-h-[200px]"
                  />
                  <p className="text-xs text-gray-400 mt-3 text-right">
                    {noticeText !== (selectedEnquiry.notice || '') ? 'Unsaved changes' : 'All changes saved.'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
