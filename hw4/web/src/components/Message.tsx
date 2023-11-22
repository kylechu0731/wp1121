import { cn } from "@/lib/utils"
import SelectBar from "./SelectBar";
import React, { useContext } from "react";
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

  const urlify = (text: string) => {
    const regex = /(([a-z]+:\/\/)?(([a-z0-9]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_]*)(\?[a-z0-9+_\-%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
    const text_array = text.split(/(\s+)/);

    return (
      <>
        {text_array.map((text, i) => 
          regex.test(text) ?
            <a
              key={i} target="_blank" href={"//" + text} rel="noreferrer noopener"
              className={cn(sent? "text-blue-500" : "text-blue-400", "underline")}
            >{text}</a>
            :
            (text[0] === " " ? text.replaceAll(" ", "\xa0") : text)
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex break-words">
        {sent && <div className="ml-auto"/>}
        { (unsendState === 0 || (unsendState === 1 && !sent)) ?
        <div 
          className={cn("max-w-[70%] px-2 rounded-[2px] border-2 border-white", sent? "bg-white text-black":"")}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if(!unsendState)
              setSelectId(selectId === id ? 0: id);
          }}
        >{urlify(content)}</div>
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