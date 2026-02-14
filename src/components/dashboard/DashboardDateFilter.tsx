"use client";

import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PresetRange = "THIS_MONTH" | "LAST_MONTH" | "LAST_3_MONTHS" | "CUSTOM";

type DashboardDateFilterProps = {
  startDate?: string;
  endDate?: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
};

const presets: Array<{ label: string; value: PresetRange }> = [
  { label: "This month", value: "THIS_MONTH" },
  { label: "Last month", value: "LAST_MONTH" },
  { label: "Last 3 months", value: "LAST_3_MONTHS" },
];

export function DashboardDateFilter({
  startDate,
  endDate,
  onChange,
}: DashboardDateFilterProps) {
  const activePreset = useMemo<PresetRange>(() => {
    if (!startDate || !endDate) {
      return "THIS_MONTH";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    if (
      start.getTime() === thisMonthStart.getTime() &&
      end.getTime() === thisMonthEnd.getTime()
    ) {
      return "THIS_MONTH";
    }

    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    if (
      start.getTime() === lastMonthStart.getTime() &&
      end.getTime() === lastMonthEnd.getTime()
    ) {
      return "LAST_MONTH";
    }

    const lastThreeStart = startOfMonth(subMonths(now, 2));
    if (
      start.getTime() === lastThreeStart.getTime() &&
      end.getTime() === thisMonthEnd.getTime()
    ) {
      return "LAST_3_MONTHS";
    }

    return "CUSTOM";
  }, [startDate, endDate]);

  const handlePresetClick = (preset: PresetRange) => {
    const now = new Date();

    switch (preset) {
      case "THIS_MONTH":
        onChange({
          startDate: format(startOfMonth(now), "yyyy-MM-dd"),
          endDate: format(endOfMonth(now), "yyyy-MM-dd"),
        });
        break;
      case "LAST_MONTH": {
        const start = startOfMonth(subMonths(now, 1));
        const end = endOfMonth(subMonths(now, 1));
        onChange({
          startDate: format(start, "yyyy-MM-dd"),
          endDate: format(end, "yyyy-MM-dd"),
        });
        break;
      }
      case "LAST_3_MONTHS": {
        const start = startOfMonth(subMonths(now, 2));
        const end = endOfMonth(now);
        onChange({
          startDate: format(start, "yyyy-MM-dd"),
          endDate: format(end, "yyyy-MM-dd"),
        });
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm lg:flex-row lg:items-end lg:justify-between">
      <div className="flex gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            variant={activePreset === preset.value ? "default" : "outline"}
            onClick={() => handlePresetClick(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="dashboard-start-date">
            Start date
          </label>
          <Input
            id="dashboard-start-date"
            type="date"
            value={startDate ?? ""}
            onChange={(event) =>
              onChange({
                startDate: event.target.value,
                endDate:
                  endDate ?? format(endOfMonth(new Date()), "yyyy-MM-dd"),
              })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="dashboard-end-date">
            End date
          </label>
          <Input
            id="dashboard-end-date"
            type="date"
            value={endDate ?? ""}
            onChange={(event) =>
              onChange({
                startDate:
                  startDate ?? format(startOfMonth(new Date()), "yyyy-MM-dd"),
                endDate: event.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
