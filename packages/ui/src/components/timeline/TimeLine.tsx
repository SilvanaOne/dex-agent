"use client";

import { useEffect, useState, ReactNode } from "react";
import { CheckCircle, AlertCircle, XCircle, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import { debug } from "@/lib/debug";
const DEBUG = debug();

export type TimelineItemStatus = "success" | "error" | "waiting";

export type TimelineGroupStatus =
  | TimelineItemStatus
  | "warning"
  | "waiting"
  | "completed";

export type IsErrorFunction = () => boolean;
export type GetMintStatisticsFunction = () => {
  [key in TimelineItemStatus]: number;
};

export interface TimeLineItem {
  lineId: string;
  content: ReactNode;
  status: TimelineItemStatus;
}

export interface TimelineGroup {
  groupId: string;
  status: TimelineGroupStatus;
  title: string;
  errorTitle?: string;
  successTitle?: string;
  requiredForSuccess?: string[];
  keepOnTop?: boolean;
  lines: TimeLineItem[];
}

export interface TimelineGroupDated extends TimelineGroup {
  time: number;
}

export function addTimelineGroup(params: {
  item: TimelineGroup;
  items: TimelineGroupDated[];
}): TimelineGroupDated[] {
  const { item, items } = params;
  return [...items, { ...item, time: Date.now() }];
}

export function updateTimelineGroup(params: {
  items: TimelineGroupDated[];
  groupId: string;
  update: Partial<TimelineGroup>;
}) {
  const { items, groupId, update } = params;
  return items.map((item) =>
    item.groupId === groupId
      ? {
          ...item,
          ...update,
        }
      : item
  );
}

export function updateTimelineItem(params: {
  items: TimelineGroupDated[];
  groupId: string;
  update: TimeLineItem;
}) {
  const { items, groupId, update } = params;
  return items.map((item) => {
    if (item.groupId !== groupId) {
      return item;
    } else {
      const index = item.lines.findIndex(
        (line) => line.lineId === update.lineId
      );
      if (index === -1) {
        item.lines.push(update);
      } else {
        item.lines[index] = update;
      }
      const newStatus = item.lines.some((line) => line.status === "error")
        ? "error"
        : item.lines.some((line) => line.status === "waiting")
        ? "waiting"
        : "success";
      if (newStatus === "success" && item.requiredForSuccess) {
        const allRequiredSuccess = item.requiredForSuccess.every(
          (requiredLineId) => {
            const line = item.lines.find(
              (line) => line.lineId === requiredLineId
            );
            return line && line.status === "success";
          }
        );

        if (!allRequiredSuccess) {
          item.status = "waiting";
        } else {
          item.status = "success";
        }
      } else item.status = newStatus;
      if (DEBUG && item.status === "success") {
        console.log("success:", item);
      }
      return item;
    }
  });
}

export function deleteTimelineGroup(params: {
  items: TimelineGroupDated[];
  groupId: string;
}) {
  const { items, groupId } = params;
  return items.filter((item) => item.groupId !== groupId);
}

export interface TimeLineProps {
  items: TimelineGroupDated[];
  dark?: boolean;
  onClose?: () => void;
}

export function TimeLine({ items, dark, onClose }: TimeLineProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [sortedItems, setSortedItems] = useState<TimelineGroupDated[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!items || items?.length === 0) {
      setSortedItems([]);
      return;
    }
    const sorted = items.reverse().sort((a, b) => {
      if (a.keepOnTop && !b.keepOnTop) {
        return -1;
      }
      if (!a.keepOnTop && b.keepOnTop) {
        return 1;
      }
      if (a.status === "waiting" && b.status !== "waiting") {
        return -1;
      }
      if (a.status !== "waiting" && b.status === "waiting") {
        return 1;
      }
      return b.time - a.time;
    });
    setSortedItems(sorted);
  }, [items]);

  function timelineItemsList(items: TimeLineItem[]): ReactNode {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0].content;
    return (
      <ul className="list-disc pl-5" id={`logList-${Date.now()}`}>
        {items.map((item, i) => (
          <li key={`logList-${i}-${item.lineId}`}>{item.content}</li>
        ))}
      </ul>
    );
  }

  function groupTitle(group: TimelineGroup): ReactNode {
    if (group.status === "error") {
      return group.errorTitle ?? group.title;
    }
    if (group.status === "success") {
      return group.successTitle ?? group.title;
    }
    return group.title;
  }

  return (
    <div className="mb-10 shrink-0 basis-8/12 space-y-5 lg:mb-0 lg:pr-10">
      {onClose && (
        <div className="flex justify-end">
          <button
            className="group hover:bg-accent focus:bg-accent p-2 rounded-lg transition-colors"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-4 w-4 fill-jacarta-500 group-hover:fill-white group-focus:fill-white dark:fill-jacarta-200"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
            </svg>
          </button>
        </div>
      )}
      {sortedItems.map((elm, i) => (
        <div
          key={i}
          className={`relative flex items-center rounded-2.5xl border border-jacarta-100 bg-white p-4 transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-jacarta-${
            dark === true ? "900" : "700"
          }`}
        >
          <div>
            <h3 className="mb-1 font-display font-semibold text-jacarta-700 dark:text-white">
              {groupTitle(elm)}
            </h3>
            <span className="mb-1 block text-sm text-jacarta-500 dark:text-white">
              {timelineItemsList(elm.lines)}
            </span>
          </div>

          <div className="ml-auto flex flex-col items-center w-1/6">
            <div className="rounded-full p-1">{statusIcons[elm.status]}</div>
            {elm.status === "waiting" && (
              <span className="block text-xs text-jacarta-300">
                {formatTime(elm.time, currentTime)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

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
      style={{ stroke: "url(#gradient)" }} // Add gradient for a better color transition
    />
    <motion.circle
      cx="12"
      cy="12"
      r="5"
      initial={{ fill: "#3b82f6", scale: 0.8 }}
      animate={{
        fill: ["#3b82f6", "#10b981", "#3b82f6"], // Blue to green to blue transition
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    {/* Define the gradient */}
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const statusIcons = {
  success: <CheckCircle color="#22c55e" />,
  warning: <AlertCircle color="#eab308" />,
  error: <XCircle color="#ef4444" />,
  waiting: <WaitingIcon />,
  completed: <CheckSquare color="#a855f7" />,
};

function formatTime(time: number, currentTime: number): string {
  if (time > currentTime) return "";
  const timePassed = Math.floor((currentTime - time) / 1000);
  const minutes = Math.floor(timePassed / 60);
  const seconds = timePassed % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
