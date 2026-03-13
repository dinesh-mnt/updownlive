"use client";
import React from 'react';
import { Database, TrendingUp, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";

export default function Dashboard() {
  return (
    <div className="font-outfit">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black mb-2 tracking-tight">Admin Dashboard</h1>
        <p className="text-brand-gray text-lg">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="rounded-3xl border-brand-border shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-brand-gray font-bold uppercase tracking-wider text-sm z-10">Total API Calls</h3>
            <div className="text-brand-blue/20 group-hover:text-brand-blue/40 transition-colors">
              <Database size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-brand-black mb-2 z-10">1,254</div>
            <div className="flex items-center gap-1 text-green-500 font-bold text-sm z-10">
              <TrendingUp size={16} /> +12% this week
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-brand-border shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-brand-gray font-bold uppercase tracking-wider text-sm z-10">Active Users</h3>
            <div className="text-brand-red/10 group-hover:text-brand-red/20 transition-colors">
              <Users size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-brand-black mb-2 z-10">328</div>
            <div className="flex items-center gap-1 text-green-500 font-bold text-sm z-10">
              <TrendingUp size={16} /> +5% this week
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-brand-border shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-brand-gray font-bold uppercase tracking-wider text-sm z-10">System Status</h3>
            <div className="text-brand-black/5 group-hover:text-brand-black/10 transition-colors">
              <Activity size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-brand-black mb-2 z-10">Connected</div>
            <div className="flex items-center gap-1 text-green-500 font-bold text-sm z-10">
              <div className="w-2 h-2 rounded-full bg-green-500"></div> Online
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
