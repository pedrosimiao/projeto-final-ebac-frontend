// src/api/notificationApi.ts

import apiClient from "./apiClient";
import { INotification, IPaginatedResponse } from "../types";

export const fetchNotificationsAPI = async (cursor?: string): Promise<IPaginatedResponse<INotification[]>> => {
  const params = cursor ? { cursor } : {}

  const response = await apiClient.get<IPaginatedResponse<INotification[]>>("/notifications/", {
    params,
  });
  return response.data;
};

export const markNotificationAsReadAPI = async (notificationId: string): Promise<void> => {
  await apiClient.patch(`/notifications/${notificationId}/`, { is_read: true });
};

export const markAllNotificationsAsReadAPI = async (): Promise<void> => {
  await apiClient.patch("/mark_all_as_read/");
};

