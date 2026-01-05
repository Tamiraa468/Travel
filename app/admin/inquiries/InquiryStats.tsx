"use client";

/**
 * InquiryStats Component
 * Displays conversion metrics for the sales pipeline
 */

import Link from "next/link";
import {
  Users,
  MessageCircle,
  FileText,
  CheckCircle,
  TrendingUp,
  XCircle,
  PauseCircle,
} from "lucide-react";

interface InquiryStatsProps {
  stats: {
    total: number;
    new: number;
    contacted: number;
    quoted: number;
    negotiating: number;
    won: number;
    lost: number;
    onHold: number;
  };
  currentStatus: string;
}

export default function InquiryStats({
  stats,
  currentStatus,
}: InquiryStatsProps) {
  const conversionRate =
    stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : "0";

  const quoteToWinRate =
    stats.quoted > 0
      ? ((stats.won / (stats.quoted + stats.won + stats.lost)) * 100).toFixed(1)
      : "0";

  const statCards = [
    {
      label: "Total Leads",
      value: stats.total,
      icon: Users,
      color: "bg-slate-500",
      bgColor: "bg-slate-50",
    },
    {
      label: "New (Action Needed)",
      value: stats.new,
      icon: MessageCircle,
      color: "bg-gold-500/100",
      bgColor: "bg-gold-500/10",
      href: "/admin/inquiries?status=NEW",
      urgent: stats.new > 0,
    },
    {
      label: "Quoted",
      value: stats.quoted,
      icon: FileText,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      label: "Won Deals",
      value: stats.won,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div
              className={`${stat.bgColor} rounded-xl p-5 border ${
                stat.urgent
                  ? "border-blue-300 ring-2 ring-blue-200"
                  : "border-transparent"
              } hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {stat.urgent && (
                  <span className="px-2 py-1 bg-gold-500/100 text-white text-xs rounded-full animate-pulse">
                    Action Needed
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      {/* Conversion Metrics */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          Conversion Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-sm">Overall Conversion</p>
            <p className="text-3xl font-bold text-amber-400">
              {conversionRate}%
            </p>
            <p className="text-xs text-slate-500">Leads → Won</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Quote-to-Win Rate</p>
            <p className="text-3xl font-bold text-green-400">
              {quoteToWinRate}%
            </p>
            <p className="text-xs text-slate-500">Quoted → Won</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">In Pipeline</p>
            <p className="text-3xl font-bold text-blue-400">
              {stats.new + stats.contacted + stats.quoted + stats.negotiating}
            </p>
            <p className="text-xs text-slate-500">Active leads</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Lost</p>
            <p className="text-3xl font-bold text-red-400">{stats.lost}</p>
            <p className="text-xs text-slate-500">Not converted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
