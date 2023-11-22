import { Message } from "./message";
import { User } from "./user";

export type Room = {
  id: number;
  viewerId: User["displayId"];
  counterId: User["displayId"];
  announceId: Message["id"];
  read: boolean;
  recentTime: Date;
};
