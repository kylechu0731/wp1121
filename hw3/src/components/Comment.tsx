import TimeText from "./TimeText";
import UserName from "./UserName";
import { Separator } from "./ui/separator";

export default function Comment({
  commenterName,
  content,
  createdAt,
}: {
  commenterName: string,
  content: string,
  createdAt: Date | null,
}) {
  return (
    <>
      <div className="my-1 ml-5">
        <div className="flex gap-2">
          <UserName
            className=""
            className2="text-[22px] -mt-1"
            username={commenterName}
          />
          <div className="mt-[1.5px] text-sm">
            <TimeText date={new Date(createdAt ?? "")} format="h:mm A · D MMM YYYY"/>
          </div>
        </div>
        <div className="-mt-1 break-words">
          {content}
        </div>
      </div>
      <Separator className="ml-[2%] w-[96%]"/>
    </>
  );
}