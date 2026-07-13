"use client"

import { FilterBar } from "@/features/components/global/filter-bar";
import { ActivityLogsTable } from "@/features/logs/components/activity-logs-table";
import { useActivityLogs } from "@/hooks/use-activity-logs";
import { useState } from "react";

export default function ActivityLogsPage() {

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [startDate, endDate] = dateRange;
    const normalizedEndDate = endDate ? new Date(endDate) : null;
    if (normalizedEndDate) {
        normalizedEndDate.setHours(23, 59, 59, 999);
    }

    const { logs, isLoading } = useActivityLogs({ startDate, endDate: normalizedEndDate, limit: 50 });




    return (
        <main className="max-w-7xl md:mx-auto mx-5 py-5">
            <FilterBar startDate={startDate} endDate={endDate} onChange={(update) => setDateRange(update)} />
            <ActivityLogsTable logs={logs} isLoading={isLoading} />
        </main>
    )
}