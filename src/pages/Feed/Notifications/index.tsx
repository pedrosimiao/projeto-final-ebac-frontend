// src/pages/Feed/Notifications/index.tsx

import { RefObject, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";

import { useNotifications } from "../../../hooks/useNotifications";

import FeedHeader from "../../../components/FeedHeader";
import NotificationList from "../../../components/NotificationList";

import { FaArrowLeft } from "react-icons/fa";

import { BackLink, FeedHeaderTextContent } from "../../../components/FeedHeader/styles";
import { NotificationsContainer } from "./styles";

interface OutletContextType {
  pageScrollRef: RefObject<HTMLDivElement>;
}

export default function Notifications() {
  const { pageScrollRef } = useOutletContext<OutletContextType>();

  const { notifications, isLoading, isError, error, markAllAsRead, isMarkingAsRead } = useNotifications();

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const hasTriggeredMarkAll = useRef(false);

  useEffect(() => {
    if (notifications && unreadCount > 0 && !isMarkingAsRead && !hasTriggeredMarkAll.current) {
      console.log("Notifications: Triggering markAllAsRead because there are unread notifications.");
      markAllAsRead();
      hasTriggeredMarkAll.current = true;
    }
  }, [notifications, unreadCount, markAllAsRead, isMarkingAsRead]);


  if (!pageScrollRef || !pageScrollRef.current) {
    return (
      <NotificationsContainer>
        <FeedHeader>
          <BackLink to="/home">
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Notifications</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
        <p>Initializing page content...</p> {/* Ou um spinner mais genérico */}
      </NotificationsContainer>
    );
  }


  if (isLoading && notifications.length === 0) {
    return (
      <NotificationsContainer>
        <FeedHeader>
          <BackLink to="/home">
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Notifications</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
        <NotificationList pageScrollRef={pageScrollRef} />
      </NotificationsContainer>
    );
  }

  if (isError) {
    return (
      <NotificationsContainer>
        <FeedHeader>
          <BackLink to="/home">
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <h1>Notifications</h1>
          </FeedHeaderTextContent>
        </FeedHeader>
        <p>Error loading notifications: {error?.message}</p>
      </NotificationsContainer>
    );
  }

  return (
    <NotificationsContainer>
      <FeedHeader>
        <BackLink to="/home">
          <FaArrowLeft />
        </BackLink>
        <FeedHeaderTextContent>
          <h1>Notifications</h1>
        </FeedHeaderTextContent>
      </FeedHeader>
      <NotificationList pageScrollRef={pageScrollRef} />
    </NotificationsContainer>
  );
}
