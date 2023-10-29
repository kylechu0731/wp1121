"use client";

import { useRef, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./ui/datepicker";
import { cn, earlier, morethanaweek } from "@/lib/utils";
import { NewEventAlertDialog } from "./NewEventAlertDialog";

type NewEventDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (e: boolean) => void;
};

export default function NewEventDialog({
  dialogOpen,
  setDialogOpen,
}: NewEventDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const eventnameInputRef = useRef<HTMLInputElement>(null);
  // const startTimeInputRef = useRef<HTMLInputElement>(null);
  // const endTimeInputRef = useRef<HTMLInputElement>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [nameError, setNameError] = useState(false);
  const [timeError, setTimeError] = useState(0);
  const [startHourError, setStartHourError] = useState(false);
  const [endHourError, setEndHourError] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startEmpty, setStartEmpty] = useState(false);
  const [endEmpty, setEndEmpty] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  // handleSave modifies the query params to set the username and handle
  // we get from the input fields. src/app/page.tsx will read the query params
  // and insert the user into the database.
  const handleSave = () => {
    let result = true;
    
    const eventname = eventnameInputRef.current?.value;
    const starttime = parseFloat(startTime);
    const endtime = parseFloat(endTime);
    
    if(!eventname) {
      setNameError(true);
      result = false;
    } else setNameError(false);

    if(starttime === null || !Number.isInteger(starttime) || starttime < 0 || starttime > 23) {
      setStartTime("");
      setStartHourError(true);
      result = false;
    } else setStartHourError(false);

    if(endtime === null || !Number.isInteger(endtime) || endtime < 0 || endtime > 23) {
      setEndTime("");
      setEndHourError(true);
      result = false;
    } else setEndHourError(false);

    if(!startDate) {
      setStartEmpty(true);
      result = false;
    } else setStartEmpty(false);

    if(!endDate) {
      setEndEmpty(true);
      result = false;
    } else setEndEmpty(false);

    if(startDate && endDate && startTime && endTime && Number.isInteger(starttime) && Number.isInteger(endtime)) {
      if(!earlier(startDate, endDate, starttime, endtime)) {
        setTimeError(1);
        result = false;
      }
      else if(morethanaweek(startDate, endDate, starttime, endtime)) {
        setTimeError(2);
        result = false;
      } else setTimeError(0);
    }

    if(result) {
      setDialogOpen(false);
      setStartDate(undefined);
      setEndDate(undefined);
      setStartTime("");
      setEndTime("");
    }
    
    return result;
  };

  const handleOpenChange = (open: boolean) => {
    if (open)
      setDialogOpen(true);
    else
      setAlertDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("");
    setEndTime("");
    setNameError(false);
    setStartEmpty(false);
    setEndEmpty(false);
    setStartHourError(false);
    setEndHourError(false);
    setTimeError(0);
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Organise an event</DialogTitle>
            <DialogDescription>
              Tell us more about your event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Event Name
              </Label>
              <Input
                placeholder="Come up with some cool name!"
                ref={eventnameInputRef}
                className={cn("col-span-3",
                            nameError && "border-red-500")}
              />
            </div>
            {nameError && (
                <div className="ml-[100px] text-xs text-red-500 -mt-[10px]">
                  Event name must not be empty.
                </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="starttime" className="text-right">
                Start at
              </Label>
              <DatePicker
                className={cn("w-[200px]",
                            (startEmpty || timeError === 1) && "border-red-500 text-red-500")}
                date={startDate}
                setDate={setStartDate}
              />
              <Input
                placeholder={startHourError? "0-23" : "Time"}
                onChange={(e) => setStartTime(e.target.value)}
                value={startTime}
                className={cn("w-[70px] ml-[110px]",
                            (startHourError || timeError === 1) && "border-red-500",
                            (startHourError) && "placeholder:text-red-500")}
              />
            </div>
            {timeError === 1 && (
                <div className="ml-[100px] text-xs text-red-500 -mt-[10px]">
                  Start time should be the earlier one.
                </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="starttime" className="text-right">
                End at
              </Label>
              <DatePicker
                className={cn("w-[200px]",
                            (endEmpty || timeError === 2) && "border-red-500 text-red-500")}
                date={endDate}
                setDate={setEndDate}
              />
              <Input
                placeholder={endHourError? "0-23" : "Time"}
                onChange={(e) => setEndTime(e.target.value)}
                value={endTime}
                className={cn("w-[70px] ml-[110px]",
                            (endHourError || timeError === 2) && "border-red-500",
                            (endHourError) && "placeholder:text-red-500")}
              />
            </div>
            {timeError === 2 && (
                <div className="ml-[100px] text-xs text-red-500 -mt-[10px]">
                  The event must not last longer than a week.
                </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Launch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <NewEventAlertDialog 
        dialogOpen={alertDialogOpen}
        setDialogOpen={setAlertDialogOpen}
        close={handleClose}
      />
    </>
  );
}