"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/UI/Table';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';
import { Eye, CheckCircle, XCircle, Loader2, User as UserIcon, Shield, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get(`/users`);
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch users from the database.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateStatus = async (userId: string, status: 'approved' | 'rejected') => {
        setIsUpdating(true);
        try {
            await axiosInstance.patch(`/users/${userId}/status`, { status });
            toast({
                title: 'Status Updated',
                description: `User account has been ${status === 'approved' ? 'approved' : 'rejected'}.`,
            });
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: 'Update Failed',
                description: 'Could not update user verification status.',
                variant: 'destructive',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[600px] flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-3xl border border-brand-light dark:border-white/10 font-outfit transition-colors duration-300">
                <Loader2 className="h-10 w-10 animate-spin text-brand-blue mb-4" />
                <p className="text-brand-gray dark:text-gray-400 font-bold animate-pulse">Retrieving user data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-420 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                     <Link href="/admin/dashboard" className="inline-flex items-center text-sm font-bold text-brand-blue hover:text-brand-red transition-colors mb-2">
                        <ArrowLeft size={14} className="mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-brand-black dark:text-white tracking-tight">User Management</h1>
                    <p className="text-brand-gray dark:text-gray-400 font-medium mt-1">Review and verify user access levels.</p>
                </div>
                <div className="bg-brand-blue/10 px-4 py-2 rounded-xl border border-brand-blue/20">
                    <span className="text-brand-blue font-bold text-sm flex items-center gap-2">
                        <UserIcon size={16} /> Total Users: {users.length}
                    </span>
                </div>
            </div>

            <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-4xl overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300">
                <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 px-8 py-6">
                    <CardTitle className="text-xl font-black text-brand-black dark:text-white">Platform Registry</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-8 py-4 font-bold text-white dark:text-gray-300 text-base">Subscriber</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-white dark:text-gray-300 text-base">Email Identity</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-white dark:text-gray-300 text-base">Authority</TableHead>
                                    <TableHead className="px-6 py-4 font-bold text-white dark:text-gray-300 text-base">Verification Status</TableHead>
                                    <TableHead className="px-8 py-4 font-bold text-white dark:text-gray-300 text-base">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20">
                                            <p className="text-brand-gray dark:text-gray-400 font-bold text-lg">No users found in the system.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id || user._id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors border-b border-slate-50 dark:border-white/5 group">
                                            <TableCell className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white font-black shadow-lg shadow-brand-blue/10">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-brand-black dark:text-white">{user.name}</span>
                                                        <span className="text-[10px] text-brand-gray dark:text-gray-500 font-bold uppercase tracking-tight">ID: {(user.id || user._id)?.toString().substring(0, 8)}...</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <span className="text-brand-gray dark:text-gray-400 font-medium">{user.email}</span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <Badge 
                                                    variant={user.role === 'admin' ? 'default' : 'secondary'} 
                                                    className={cn(
                                                        "rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                                                        user.role === 'admin' ? "bg-brand-blue shadow-lg shadow-brand-blue/20" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-400"
                                                    )}
                                                >
                                                    {user.role || 'user'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <Badge 
                                                    variant={
                                                        user.verifiedStatus === 'approved' ? 'success' : 
                                                        user.verifiedStatus === 'rejected' ? 'destructive' : 'outline'
                                                    }
                                                    className={cn(
                                                        "rounded-lg px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                                                        user.verifiedStatus === 'approved' ? "shadow-lg shadow-green-500/10" : 
                                                        user.verifiedStatus === 'rejected' ? "shadow-lg shadow-red-500/10" : ""
                                                    )}
                                                >
                                                    {user.verifiedStatus || 'pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-8 py-5 text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsModalOpen(true);
                                                    }}
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

            {/* User Detail Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-brand-blue to-brand-blue/60 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-brand-blue/30 rotate-3">
                                        {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-brand-black dark:text-white tracking-tight leading-none mb-1">{selectedUser.name}</h2>
                                        <p className="text-brand-blue font-bold tracking-wide">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-2xl hover:bg-brand-light dark:hover:bg-white/10">
                                    <XCircle size={28} className="text-brand-gray dark:text-gray-400" />
                                </Button>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} className="text-brand-blue" />
                                        <span className="text-brand-gray dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Security Role</span>
                                    </div>
                                    <span className="font-black text-brand-black dark:text-white capitalize">{selectedUser.role || 'Standard User'}</span>
                                </div>
                                
                                <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={20} className="text-brand-blue" />
                                        <span className="text-brand-gray dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Auth Identifier</span>
                                    </div>
                                    <span className="font-mono text-[10px] text-brand-black dark:text-white bg-white dark:bg-black px-3 py-1 rounded-lg border border-slate-200 dark:border-white/10">{selectedUser.id || selectedUser._id}</span>
                                </div>

                                {/* Contact Information */}
                                {selectedUser.phone && (
                                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <span className="text-brand-gray dark:text-gray-400 font-bold uppercase tracking-widest text-xs block mb-2">Phone Number</span>
                                        <span className="font-black text-brand-black dark:text-white">{selectedUser.phone}</span>
                                    </div>
                                )}

                                {/* Address Information */}
                                {(selectedUser.address || selectedUser.city || selectedUser.state || selectedUser.zipcode || selectedUser.country) && (
                                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <span className="text-brand-gray dark:text-gray-400 font-bold uppercase tracking-widest text-xs block mb-3">Location Details</span>
                                        <div className="space-y-2 text-sm">
                                            {selectedUser.address && (
                                                <div>
                                                    <span className="text-brand-gray dark:text-gray-500 text-xs">Address:</span>
                                                    <p className="font-bold text-brand-black dark:text-white">{selectedUser.address}</p>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedUser.city && (
                                                    <div>
                                                        <span className="text-brand-gray dark:text-gray-500 text-xs">City:</span>
                                                        <p className="font-bold text-brand-black dark:text-white">{selectedUser.city}</p>
                                                    </div>
                                                )}
                                                {selectedUser.state && (
                                                    <div>
                                                        <span className="text-brand-gray dark:text-gray-500 text-xs">State:</span>
                                                        <p className="font-bold text-brand-black dark:text-white">{selectedUser.state}</p>
                                                    </div>
                                                )}
                                                {selectedUser.zipcode && (
                                                    <div>
                                                        <span className="text-brand-gray dark:text-gray-500 text-xs">Zipcode:</span>
                                                        <p className="font-bold text-brand-black dark:text-white">{selectedUser.zipcode}</p>
                                                    </div>
                                                )}
                                                {selectedUser.country && (
                                                    <div>
                                                        <span className="text-brand-gray dark:text-gray-500 text-xs">Country:</span>
                                                        <p className="font-bold text-brand-black dark:text-white">{selectedUser.country}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button 
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-black py-8 rounded-2xl shadow-xl shadow-green-500/20 transition-all active:scale-95 group"
                                    onClick={() => handleUpdateStatus(selectedUser.id || selectedUser._id, 'approved')}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" /> : (
                                        <div className="flex flex-col items-center">
                                            <CheckCircle size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                                            <span>APPROVE ACCOUNT</span>
                                        </div>
                                    )}
                                </Button>
                                <Button 
                                    variant="destructive"
                                    className="flex-1 font-black py-8 rounded-2xl shadow-xl shadow-brand-red/20 transition-all active:scale-95 group"
                                    onClick={() => handleUpdateStatus(selectedUser.id || selectedUser._id, 'rejected')}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" /> : (
                                        <div className="flex flex-col items-center">
                                            <XCircle size={24} className="mb-1 group-hover:scale-110 transition-transform" />
                                            <span>REJECT ACCOUNT</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                            
                            <p className="text-center mt-6 text-[10px] font-bold text-brand-gray uppercase tracking-widest">
                                Verification will be reflected on the user's profile immediately.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
