import type {
  CreateSongPayload,
  CreateSongResponse,
  CreateListPayload,
  CreateListResponse,
  GetSongsResponse,
  GetListsResponse,
  UpdateSongPayload,
  UpdateSongResponse,
  DeleteSongResponse,
  DeleteListResponse,
  UpdateListPayload,
  UpdateListResponse,
} from "@lib/shared_types";
import axios from "axios";

import { env } from "./env";

const client = axios.create({
  baseURL: env.VITE_API_URL,
});

export function getLists() {
  return client.get<GetListsResponse>("/kc_lists");
}

export function getSongs() {
  return client.get<GetSongsResponse>("/kc_songs");
}

export function createList(input: CreateListPayload) {
  return client.post<CreateListResponse>("/kc_lists", input);
}

export function createSong(input: CreateSongPayload) {
  return client.post<CreateSongResponse>("/kc_songs", input);
}

export function updateSong(id: string, input: UpdateSongPayload) {
  return client.put<UpdateSongResponse>(`/kc_songs/${id}`, input);
}

export function updateList(id: string, input: UpdateListPayload) {
  return client.put<UpdateListResponse>(`/kc_lists/${id}`, input);
}

export function deleteSong(id: string) {
  return client.delete<DeleteSongResponse>(`/kc_songs/${id}`);
}

export function deleteList(id: string) {
  return client.delete<DeleteListResponse>(`/kc_lists/${id}`);
}
