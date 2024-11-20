/* eslint-disable no-unused-vars */
"use client";

import { Clock } from "lucide-react";
import { Label } from "./label";
import { TimePickerInput } from "./time-picker-input";
import { useRef } from "react";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: Readonly<TimePickerProps>) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-center items-end gap-2">
      <div className="flex flex-col items-center gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hora
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutos
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      <div className="flex items-center h-10">
        <Clock className="ml-2 w-4 h-4" />
      </div>
    </div>
  );
}
