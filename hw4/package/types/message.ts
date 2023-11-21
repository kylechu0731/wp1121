import { User } from "./user";

export type Message = {
  id: number;
  content: string;
  senderId: User["displayId"];
  receiverId: User["displayId"];
  unsendState: number;
  sentAt: Date;
};
