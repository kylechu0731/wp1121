import { Message } from "./message";
import { User } from "./user";

export type Room = {
  id: number;
  viewerId: User["displayId"];
  counterId: User["displayId"];
  announceId: Message["id"];
  recentTime: Date;
};
