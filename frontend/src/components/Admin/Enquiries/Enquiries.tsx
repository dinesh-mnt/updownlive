"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Loader2, Calendar, Phone, Building, Eye, X, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/UI/Table";
import { Button } from "@/components/UI/Button";
import { Badge } from "@/components/UI/Badge";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [noticeText, setNoticeText] = useState('');
  const [savingNotice, setSavingNotice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

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
      await axios.patch(`${apiUrl}/enquiries/${selectedEnquiry._id}/notice`, { 
        notice: noticeText 
      }, { withCredentials: true });
      
      setEnquiries(enquiries.map(enq => 
        enq._id === selectedEnquiry._id ? { ...enq, notice: noticeText } : enq
      ));
      setSelectedEnquiry({ ...selectedEnquiry, notice: noticeText });
      
      toast({
        title: 'Notice Saved',
        description: 'Admin notice has been updated successfully.',
      });
    } catch (err) {
      console.error('Failed to save notice:', err);
      toast({
        title: 'Save Failed',
        description: 'Could not save the notice. Please try again.',
        variant: 'destructive',
      });
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
      toast({
        title: 'Error',
        description: 'Failed to fetch enquiries from the database.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-brand-light font-outfit">
        <Loader2 className="h-10 w-10 animate-spin text-brand-blue mb-4" />
        <p className="text-brand-gray font-bold animate-pulse">Retrieving enquiry data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-bold text-brand-blue hover:text-brand-red transition-colors mb-2">
            <ArrowLeft size={14} className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-black text-brand-black tracking-tight">Enquiry Management</h1>
          <p className="text-brand-gray font-medium mt-1">View and manage contact form submissions.</p>
        </div>
        <div className="bg-brand-blue/10 px-4 py-2 rounded-xl border border-brand-blue/20">
          <span className="text-brand-blue font-bold text-sm flex items-center gap-2">
            <Mail size={16} /> Total Enquiries: {filteredEnquiries.length}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Search by name, email, or company..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 h-12 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-brand-gray focus:outline-none focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
        />
      </div>

      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-4xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
          <CardTitle className="text-xl font-black text-brand-black">Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-8 py-4 font-bold text-white  text-base ">Date</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-white  text-base ">Department</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-white  text-base ">Contact Info</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-white  text-base ">Company</TableHead>
                  <TableHead className="px-6 py-4 font-bold text-white  text-base ">Message</TableHead>
                  <TableHead className="px-8 py-4 font-bold text-white  text-base  text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <p className="text-brand-gray font-bold text-lg">No enquiries found in the system.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnquiries.map((enq) => (
                    <TableRow key={enq._id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 group">
                      <TableCell className="px-8 py-5">
                        <div className="flex items-center gap-2 text-brand-gray font-medium">
                          <Calendar size={16} className="text-brand-blue" />
                          <span className="text-sm">{new Date(enq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge 
                          variant="default"
                          className="rounded-lg p-2 font-bold text-white bg-brand-blue shadow-lg shadow-brand-blue/20"
                        >
                          {enq.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-brand-black text-sm">{enq.firstName} {enq.lastName}</span>
                          <a href={`mailto:${enq.email}`} className="text-xs text-brand-blue hover:underline flex items-center gap-1">
                            <Mail size={12} /> {enq.email}
                          </a>
                          {enq.phone && (
                            <a href={`tel:${enq.phone}`} className="text-xs text-brand-gray hover:text-brand-black flex items-center gap-1">
                              <Phone size={12} /> {enq.phone}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        {enq.companyName ? (
                          <div className="flex items-center gap-2 text-brand-gray font-medium">
                            <Building size={14} className="text-brand-blue" />
                            <span className="text-sm">{enq.companyName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-brand-gray italic">Not provided</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="text-sm text-brand-gray line-clamp-2 max-w-xs">
                          {enq.message}
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-5 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedEnquiry(enq)}
                          className="rounded-xl hover:bg-brand-blue/10 text-white bg-brand-blue hover:text-brand-blue font-black transition-all group-hover:scale-105"
                        >
                          <Eye size={16} className="mr-2" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Detail Modal */}
      {selectedEnquiry && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 flex-shrink-0">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-brand-blue/30 rotate-3">
                    {selectedEnquiry.firstName?.charAt(0).toUpperCase() || 'E'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-brand-black tracking-tight leading-none mb-1">
                      {selectedEnquiry.firstName} {selectedEnquiry.lastName}
                    </h2>
                    <p className="text-brand-blue font-bold tracking-wide">{selectedEnquiry.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(null)} className="rounded-2xl hover:bg-brand-light">
                  <X size={28} className="text-brand-gray" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Building size={20} className="text-brand-blue" />
                    <span className="text-brand-gray font-bold uppercase tracking-widest text-xs">Company</span>
                  </div>
                  <span className="font-black text-brand-black">{selectedEnquiry.companyName || 'Not provided'}</span>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone size={20} className="text-brand-blue" />
                    <span className="text-brand-gray font-bold uppercase tracking-widest text-xs">Phone</span>
                  </div>
                  <span className="font-black text-brand-black">{selectedEnquiry.phone || 'Not provided'}</span>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={20} className="text-brand-blue" />
                    <span className="text-brand-gray font-bold uppercase tracking-widest text-xs">Date Submitted</span>
                  </div>
                  <span className="font-black text-brand-black text-sm">
                    {new Date(selectedEnquiry.createdAt).toLocaleString(undefined, { 
                      dateStyle: 'full', 
                      timeStyle: 'short' 
                    })}
                  </span>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={20} className="text-brand-blue" />
                    <span className="text-brand-gray font-bold uppercase tracking-widest text-xs">Department</span>
                  </div>
                  <Badge className="bg-brand-blue text-white font-bold">{selectedEnquiry.department}</Badge>
                </div>
              </div>
            </div>

            <div className="px-10 pb-10 flex-1 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-3 block">Message</label>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed text-brand-black">
                    {selectedEnquiry.message}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">Admin Notice / Notes</label>
                    <Button
                      onClick={handleSaveNotice}
                      disabled={savingNotice || noticeText === selectedEnquiry.notice}
                      className="bg-brand-blue hover:bg-blue-700 text-white gap-2 rounded-xl font-black"
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
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 text-brand-black focus:outline-none focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue transition-all resize-none min-h-[150px]"
                  />
                  <p className="text-xs text-brand-gray mt-2 text-right font-medium">
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
