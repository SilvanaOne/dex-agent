"use client";

import React, { useRef } from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type TimelineItem = {
  id: string;
  status: "success" | "warning" | "error" | "waiting" | "completed";
  title: string;
  description: React.ReactNode;
  date: Date;
};

export function updateTimelineItem(params: {
  items: TimelineItem[];
  id: string;
  update: Partial<TimelineItem>;
}) {
  const { items, id, update } = params;
  return items.map((item) => (item.id === id ? { ...item, ...update } : item));
}

export function deleteTimelineItem(params: {
  items: TimelineItem[];
  id: string;
}) {
  const { items, id } = params;
  return items.filter((item) => item.id !== id);
}

export const exampleTimelineItems: TimelineItem[] = [
  {
    id: "1",
    status: "completed",
    title: "Project Kickoff",
    description: (
      <>
        Successfully launched the project. View the{" "}
        <a href="#" className="text-blue-500 hover:underline">
          kickoff document
        </a>
        .
      </>
    ),
    date: new Date("2023-06-01T09:00:00"),
  },
  {
    id: "2",
    status: "warning",
    title: "Design Review",
    description: (
      <>
        Minor issues found during review. Check the{" "}
        <a href="#" className="text-blue-500 hover:underline">
          design feedback
        </a>
        .
      </>
    ),
    date: new Date("2023-06-15T14:30:15"),
  },
  {
    id: "3",
    status: "error",
    title: "Backend Integration",
    description: (
      <>
        Critical error in API integration. See the{" "}
        <a href="#" className="text-blue-500 hover:underline">
          error log
        </a>
        .
      </>
    ),
    date: new Date("2023-07-01T11:15:30"),
  },
  {
    id: "4",
    status: "waiting",
    title: "User Testing",
    description: (
      <>
        Awaiting user feedback. Check the{" "}
        <a href="#" className="text-blue-500 hover:underline">
          testing schedule
        </a>
        .
      </>
    ),
    date: new Date("2023-07-15T10:00:45"),
  },
  {
    id: "5",
    status: "success",
    title: "Final Deployment",
    description: (
      <>
        Successfully deployed to production. View the{" "}
        <a href="#" className="text-blue-500 hover:underline">
          deployment report
        </a>
        .
      </>
    ),
    date: new Date("2023-08-01T16:45:20"),
  },
];

const WaitingIcon = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="50 50"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
    <motion.circle
      cx="12"
      cy="12"
      r="5"
      initial={{ fill: "#3b82f6", scale: 0.8 }}
      animate={{
        fill: ["#3b82f6", "#10b981", "#3b82f6"],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.svg>
);

const statusIcons = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  waiting: WaitingIcon,
  completed: CheckSquare,
};

const statusColors = {
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  waiting: "text-blue-500",
  completed: "text-purple-500",
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hour12: false,
  }).format(date);
};

export interface TimelineProps {
  title: string;
  items: TimelineItem[];
  lastItem?: TimelineItem;
}

export function Timeline(params: TimelineProps) {
  const { items, lastItem, title } = params;
  const allItems = [...items, ...(lastItem ? [lastItem] : [])];

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="space-y-3">
        {allItems.map((item, index) => (
          <div
            key={item.id + item.date.toUTCString() + item.title}
            className="flex items-start"
          >
            <div
              className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center",
                statusColors[item.status]
              )}
            >
              {React.createElement(statusIcons[item.status], {
                className: "w-4 h-4",
                "aria-hidden": "true",
              })}
            </div>
            <div className="ml-3 flex-grow">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold">{item.title}</h2>
                <span className="text-xs text-gray-500">
                  {formatTime(item.date)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
