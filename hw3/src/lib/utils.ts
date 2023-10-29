import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateUsername(username?: string | null) {
  if (!username) return false;
  return /^[a-zA-Z0-9 ]{1,50}$/.test(username);
}

export function earlier(startDate: Date, endDate: Date, starttime: number, endtime: number) {
  if(startDate.getTime() > endDate.getTime()) return false;
  if(startDate.getTime() < endDate.getTime()) return true;
  if(starttime >= endtime) return false;
  return true;
}

export function morethanaweek(startDate: Date, endDate: Date, starttime: number, endtime: number) {
  const weekAfter = new Date(startDate);
  weekAfter.setDate(weekAfter.getDate() + 7)
  return earlier(weekAfter, endDate, starttime, endtime);
}