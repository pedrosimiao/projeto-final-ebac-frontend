// src/components/NotificationList/index.tsx

import { useEffect, useRef, useCallback, RefObject, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../hooks/useNotifications";

import LoadingSpinner from "../Loading";
import { ListLoaderContainer } from "../Loading/styles";

import { getTimeAgo } from "../../utils/dateUtils";

import { INotification } from "../../types";

import {
  List,
  Item,
  Avatar,
  SenderName,
  NotificationText,
  TimeStamp,
} from "./styles";


interface NotificationListProps {
  pageScrollRef: RefObject<HTMLDivElement>;
}

// Função auxiliar para renderizar a mensagem da notificação
function renderNotificationMessage(type: INotification["type"]) {
  switch (type) {
    case "like":
      return "liked your post";
    case "comment":
      return "commented on your post";
    case "retweet":
      return "retweeted your post";
    case "follow":
      return "followed you";
    case "mention":
      return "mentioned you";
    default:
      return "sent you a notification";
  }
}

export default function NotificationList({ pageScrollRef }: NotificationListProps) {
  const navigate = useNavigate();

  const {
    notifications,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();

  const loader = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        console.log("IntersectionObserver: Fetching next page of notifications...");
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const currentLoaderElement = loader.current;
    const currentScrollRoot = pageScrollRef.current;

    if (currentLoaderElement && currentScrollRoot) {
      const options: IntersectionObserverInit = {
        root: currentScrollRoot,
        rootMargin: "0px",
        threshold: 0.1,
      };

      const observer = new IntersectionObserver(handleObserver, options);
      observer.observe(currentLoaderElement);

      return () => {
        observer.unobserve(currentLoaderElement);
      };
    }
  }, [handleObserver, pageScrollRef]);

  if (isLoading && notifications.length === 0) {
    return (
      <ListLoaderContainer>
        <LoadingSpinner $spinnerColor="accent" size="2rem" />
      </ListLoaderContainer>
    );
  }

  if (isError) {
    return <p>Error loading notifications: {error?.message}</p>;
  }

  if (!notifications || notifications.length === 0) {
    return <h4>No notifications.</h4>;
  }

  return (
    <List>
      {notifications.map((notification) => {
        const sender = notification.fromUser;

        const handleItemClick = () => {
          if (notification.type === 'follow') {
            navigate(`/${sender.username}`);
          } else if (notification.targetPostId) {
            navigate(`/status/post/${notification.targetPostId}`);
          }
        };

        const handleSenderClick = (e: MouseEvent) => {
          e.stopPropagation();
          navigate(`/${sender.username}`);
        };

        return (
          <Item key={notification.id} onClick={handleItemClick}>
            <Avatar
              src={sender.profile_picture || "/default-avatar.png"}
              alt={sender.username}
              onClick={handleSenderClick}
            />
            <NotificationText>
              <SenderName onClick={handleSenderClick}>
                {sender.firstName} {sender.lastName}
              </SenderName>{" "}
              {renderNotificationMessage(notification.type)}
              <TimeStamp>{getTimeAgo(notification.timestamp)}</TimeStamp>
            </NotificationText>
          </Item>
        );
      })}

      {hasNextPage && (
        <ListLoaderContainer ref={loader}>
          {isFetchingNextPage ? (
            <LoadingSpinner $spinnerColor="accent" size="2rem" />
          ) : (
            <div style={{ height: "1px" }}></div>
          )}
        </ListLoaderContainer>
      )}

      {!hasNextPage && !isLoading && notifications.length > 0 && (
        <ListLoaderContainer>
          <div style={{ fontStyle: "italic" }}>
            You've reached the end of the notifications.
          </div>
        </ListLoaderContainer>
      )}
    </List>
  );
}
