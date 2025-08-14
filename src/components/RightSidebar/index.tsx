// src/components/RightSidebar/index.tsx

import { useNavigate } from "react-router-dom";

import { useSuggestedUsers, useCurrentUserProfile } from "../../hooks/useUsers";
import { useFollowUser, useUnfollowUser, useIsFollowing } from "../../hooks/useFollows";
import { IUser } from "../../types";

import { useRandomHashtags } from "../../hooks/useHashtags";

import {
  RightSidebarContainer,
  RightSidebarCard,
  SuggestionList,
  SuggestionItem,
  SuggestionRow,
  FollowButton,
  RightSidebarCardTitle,
  UserAvatar,
  Wrapper,
  TrendList,
  TrendItem
} from "./styles";

// botão de seguir/deixar de seguir reativo
const FollowUserButton = ({ targetUserId }: { targetUserId: string }) => {
  const { data: currentUser } = useCurrentUserProfile(false);
  const { data: isFollowing, isLoading: isFollowingStatusLoading } = useIsFollowing(targetUserId);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const handleFollowClick = () => {
    if (!currentUser?.id) {
      // TODO: Redirecionar para a página de login se não estiver logado
      console.log("User not logged in. Please log in to follow.");
      return;
    }
    followMutation.mutate(targetUserId);
  };

  const handleUnfollowClick = () => {
    unfollowMutation.mutate(targetUserId);
  };

  const isDisabled = isFollowingStatusLoading || followMutation.isPending || unfollowMutation.isPending;

  return (
    <FollowButton
      onClick={isFollowing ? handleUnfollowClick : handleFollowClick}
      disabled={isDisabled}
    >
      {isFollowing ? "Following" : "Follow"}
    </FollowButton>
  );
};


const RightSidebar = () => {
  const { data: suggestedUsers, isLoading, isError, error } = useSuggestedUsers();
  const { data: randomTrends, isLoading: isTrendsLoading, isError: isTrendsError, error: trendsError } = useRandomHashtags(5); // Limita a 5 trends
  const navigate = useNavigate();

  if (isLoading || isTrendsLoading) {
    return (
      <RightSidebarContainer>
        <RightSidebarCard>
          <RightSidebarCardTitle>
            <h3>You might like</h3>
          </RightSidebarCardTitle>
          <p>Loading suggestions...</p>
        </RightSidebarCard>
        <RightSidebarCard>
          <RightSidebarCardTitle>
            <h4>Trends for you</h4>
          </RightSidebarCardTitle>
          <p style={{ fontStyle: "italic" }}>Loading trends...</p>
        </RightSidebarCard>
      </RightSidebarContainer>
    );
  }

  if (isError || isTrendsError) {
    console.error("Error fetching suggested users:", error);
    console.error("Error fetching trends:", trendsError);
    return (
      <RightSidebarContainer>
        <RightSidebarCard>
          <RightSidebarCardTitle>
            <h3>You might like</h3>
          </RightSidebarCardTitle>
          <p style={{ fontStyle: "italic" }}>Failed to load suggestions.</p>
        </RightSidebarCard>
        <RightSidebarCard>
          <RightSidebarCardTitle>
            <h4>Trends for you</h4>
          </RightSidebarCardTitle>
          <p style={{ fontStyle: "italic" }}>Failed to load trends.</p>
        </RightSidebarCard>
      </RightSidebarContainer>
    );
  }

  const usersToDisplay = suggestedUsers || [];

  const pedrosimiao = usersToDisplay.find(u => u.username === "pedrosimiao");
  const otherUsers = usersToDisplay.filter(u => u.username !== "pedrosimiao");

  const maxSuggestions = 3;
  const remainingSlots = pedrosimiao ? maxSuggestions - 1 : maxSuggestions;

  const shuffledOthers = [...otherUsers].sort(() => 0.5 - Math.random());

  const topSuggestions = [
    ...(pedrosimiao ? [pedrosimiao] : []),
    ...shuffledOthers.slice(0, remainingSlots)
  ];

  const handleUserClick = (username: string) => {
    navigate(`/${username}`);
  };

  return (
    <RightSidebarContainer>
      <RightSidebarCard>
        <RightSidebarCardTitle>
          <h3>You might like</h3>
        </RightSidebarCardTitle>
        <SuggestionList>
          {topSuggestions.map((user: IUser) => (
            <SuggestionItem key={user.id}>
              <SuggestionRow>
                <Wrapper onClick={() => handleUserClick(user.username)} style={{ cursor: "pointer" }}> 
                  <UserAvatar src={user.profile_picture || "/default-avatar.png"} />
                  <span>@{user.username}</span>
                </Wrapper>
                <FollowUserButton targetUserId={user.id} />
              </SuggestionRow>
            </SuggestionItem>
          ))}
        </SuggestionList>
      </RightSidebarCard>

      <RightSidebarCard>
        <RightSidebarCardTitle>
          <h3>Trends for you</h3>
        </RightSidebarCardTitle>
        <TrendList>
          {randomTrends && randomTrends.length > 0 ? (
            randomTrends.map((trend) => (
              <TrendItem key={trend.id}>
                <strong>#{trend.name}</strong>
              </TrendItem>
            ))
          ) : (
            <p style={{ fontStyle: "italic", textAlign: "center", padding: "1rem" }}>
              No trends available.
            </p>
          )}
        </TrendList>
      </RightSidebarCard>
    </RightSidebarContainer>
  );
};

export default RightSidebar;
