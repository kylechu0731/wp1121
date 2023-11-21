import { cn } from "@/lib/utils"
import SelectBar from "./SelectBar";
import { useContext } from "react";
import { UserContext } from "@/context/user";
import { set } from "zod";

export default function Message({
  id,
  sent,
  content,
  selectId,
  setSelectId,
  unsendState
}: {
  id: number,
  sent: boolean,
  content: string,
  selectId: number,
  setSelectId: (e: number) => void,
  unsendState: number
}) {
  const { chatter } = useContext(UserContext);

  return (
    <div className="flex flex-col gap-2">
      <div 
        className="flex break-words"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if(!unsendState)
            setSelectId(selectId === id ? 0: id);
        }}
      >
        {sent && <div className="ml-auto"/>}
        { (unsendState === 0 || (unsendState === 1 && !sent)) ?
        <div className={cn("max-w-[70%] px-2 rounded-[2px] border-2 border-white", sent? "bg-white text-black":"")}
        >{content}</div>
        :
        <div className="max-w-[70%] px-2 rounded-[2px] border-2 border-gray-400 text-gray-400"
        >{sent? "You have": chatter + " has"} unsent a message</div>
        }
      </div>
      { (!unsendState && selectId === id) &&
        <div className="flex">
          {sent && <div className="ml-auto"/>}
          <SelectBar
            id={id}
            handleCancel={() => setSelectId(0)}
            sent={sent}
          />
        </div>
      }
    </div>
  );
}