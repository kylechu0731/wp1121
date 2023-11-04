import { cn } from "@/lib/utils";
import localFont from 'next/font/local'

const font_nps = localFont({
  src: "./NanumPenScript-Regular.ttf"
})

type UserNameProps = {
  className: string,
  className2: string,
  username: string | null,
};

export default function UserName({
  className,
  className2,
  username,
}: UserNameProps) {
  return (
    <div className={cn("flex gap-1", className, font_nps.className)}>
      <div className={className2}>
        @{username}
      </div>
    </div>
  );
}