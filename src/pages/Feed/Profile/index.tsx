// src/pages/Feed/Profile/index.tsx

import { useCallback, useEffect, useRef, RefObject } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import {
  useCurrentUserProfile,
  useUserByUsername,
  useUpdateUserProfile
} from "../../../hooks/useUsers"

import { usePostCountByUserId } from "../../../hooks/usePosts";

import {
  useIsFollowing,
  useFollowersCount,
  useFollowingCount,
  useFollowUser,
  useUnfollowUser
} from "../../../hooks/useFollows";

import { formatDate } from "../../../utils/dateUtils";

import FeedHeader from "../../../components/FeedHeader";
import PostList from "../../../components/PostList";
import LoadingSpinner from "../../../components/Loading";

import defaultAvatar from "../../../assets/default-avatar.png"

import {
  FaArrowLeft,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCalendarAlt,
  FaCameraRetro,
} from "react-icons/fa";

import { BackLink, FeedHeaderTextContent } from "../../../components/FeedHeader/styles";

import { ListLoaderContainer } from "../../../components/Loading/styles"

import {
  ProfileContainer,
  CoverImage,
  ProfileInfo,
  ProfilePicture,
  UserName,
  UserHandle,
  StatsContainer,
  StatItem,
  AdditionalInfoContainer,
  InfoItem,
  BioContainer,
  ActionsContainer,
  EditProfileButton,
  VisitedActionsContainer,
  CoverEditButton,
  ProfilePictureWrapper,
  ProfileEditButton,
} from "./styles";

interface OutletContextType {
  pageScrollRef: RefObject<HTMLDivElement | null>;
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const { pageScrollRef } = useOutletContext<OutletContextType>();

  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUserProfile(true);

  const {
    data: profileUser,
    isLoading: isProfileUserLoading,
    isError: isProfileUserError,
    error: profileUserError
  } = useUserByUsername(username);

  const {
    mutate: updateProfile,
    isPending: updateProfileLoading,
    isSuccess: updateProfileSuccess,
    isError: updateProfileError,
    error: updateProfileErrorMessage
  } = useUpdateUserProfile();

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = profileUser?.username === currentUser?.username;

  const { postCount } = usePostCountByUserId(profileUser?.id)

  const followersCountQuery = useFollowersCount(profileUser?.id);

  const followingCountQuery = useFollowingCount(profileUser?.id);

  const isFollowing = useIsFollowing(profileUser?.id);

  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();


  const formattedBirthDate = profileUser?.birth_date
    ? `Born ${formatDate(profileUser.birth_date, "MMMM d, yyyy")}`
    : "";
  const formattedJoinedAt = profileUser?.joined_at
    ? `Joined ${formatDate(profileUser.joined_at, "MMMM yyyy")}`
    : "";



  const handleProfileUpload = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isOwnProfile) {
      console.log("Profile pic selected:", file.name);
      updateProfile({ profile_picture: file });
    }
  },
  [isOwnProfile, updateProfile]
  );

  const handleCoverUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && isOwnProfile) {
        console.log("Cover image selected:", file.name);
        updateProfile({ cover_image: file });
      }
    },
    [isOwnProfile, updateProfile]
  );



  useEffect(() => {
    if (updateProfileSuccess) {
      console.log("Profile picture/cover updated successfully!");
    }
    if (updateProfileError) {
      // Manter feedback de erro, mas via console.error (idealmente um sistema de toast)
      console.error(`Error updating profile: ${updateProfileErrorMessage}`);
    }
  }, [updateProfileSuccess, updateProfileError, updateProfileErrorMessage]);


  if (isCurrentUserLoading || isProfileUserLoading) {
    return (
      <ProfileContainer>
        <FeedHeader>
          <BackLink to="/home">
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <UserName>Loading...</UserName>
          </FeedHeaderTextContent>
        </FeedHeader>
        <ListLoaderContainer>
          <LoadingSpinner size="3rem" $spinnerColor="accent" />
        </ListLoaderContainer>
      </ProfileContainer>
    );
  }


  if (isProfileUserError) {
    if (profileUserError === "User not found.") {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>User not found</h2>
          <p>The user you are looking for does not exist.</p>
        </div>
      );
    }
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Error loading profile</h2>
        <p>{profileUserError || "An unexpected error occurred."}</p>
      </div>
    );
  }


  if (!currentUser) {
    console.error("Profile: currentUser is null after loading. Check if ProtectedRoute is working correctly.");
    navigate("/login", { replace: true });
    return null;
  }

  if (!profileUser) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Profile data not available</h2>
        <p>Could not load profile information for this user.</p>
      </div>
    );
  }


  return (
    <>
      <ProfileContainer>
        <FeedHeader>
          <BackLink to="/home">
            <FaArrowLeft />
          </BackLink>
          <FeedHeaderTextContent>
            <UserName>{`${profileUser.firstName} ${profileUser.lastName}`}</UserName>
            <StatItem>
              <span>{postCount}</span> posts
            </StatItem>
          </FeedHeaderTextContent>
        </FeedHeader>

        {profileUser.cover_image ? (
          <CoverImage src={profileUser.cover_image} alt="Cover" />
        ) : (
          <CoverImage
            as="div"
            style={{
              background: "linear-gradient(to right, #ffffff, #aaaaaa)",
              height: "200px",
            }}
          />
        )}

        {isOwnProfile && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              style={{ display: "none" }}
              onChange={handleCoverUpload}
            />
            <CoverEditButton
              onClick={() => coverInputRef.current?.click()}
              disabled={updateProfileLoading}
            >
              <FaCameraRetro />
            </CoverEditButton>
          </>
        )}

        <ProfileInfo>
          <ActionsContainer>
            {isOwnProfile ? (
              <EditProfileButton onClick={() => navigate("/settings/edit-profile")}>
                Edit profile
              </EditProfileButton>
            ) : (
              <VisitedActionsContainer>
                <EditProfileButton
                  onClick={() => {
                    if (!profileUser?.id) return;

                    if (isFollowing.data) { // Acessando .data do objeto retornado por useIsFollowing
                      unfollowUser(profileUser.id);
                    } else {
                      followUser(profileUser.id);
                    }
                  }}
                >
                  {isFollowing.data ? "Unfollow" : "Follow"}
                </EditProfileButton>
              </VisitedActionsContainer>
            )}
          </ActionsContainer>

          <ProfilePictureWrapper>
            <ProfilePicture src={profileUser.profile_picture || defaultAvatar} alt="Profile" />
            {isOwnProfile && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={profileInputRef}
                  style={{ display: "none" }}
                  onChange={handleProfileUpload}
                />
                <ProfileEditButton
                  onClick={() => profileInputRef.current?.click()}
                  disabled={updateProfileLoading}
                >
                  <FaCameraRetro />
                </ProfileEditButton>
              </>
            )}
          </ProfilePictureWrapper>

          <UserName>{`${profileUser.firstName} ${profileUser.lastName}`}</UserName>
          <UserHandle>@{profileUser.username}</UserHandle>
          <BioContainer>
            {profileUser.bio && (
              <InfoItem>
                <span>
                  <h3>{profileUser.bio}</h3>
                </span>
              </InfoItem>
            )}
          </BioContainer>

          <AdditionalInfoContainer>
            {profileUser.occupation && (
              <InfoItem>
                <FaBriefcase />
                <span>{profileUser.occupation}</span>
              </InfoItem>
            )}
            {profileUser.location && (
              <InfoItem>
                <FaMapMarkerAlt />
                <span>{profileUser.location}</span>
              </InfoItem>
            )}
            {formattedBirthDate && (
              <InfoItem>
                <FaBirthdayCake />
                <span>{formattedBirthDate}</span>
              </InfoItem>
            )}
            {formattedJoinedAt && (
              <InfoItem>
                <FaCalendarAlt />
                <span>{formattedJoinedAt}</span>
              </InfoItem>
            )}
          </AdditionalInfoContainer>
          <StatsContainer>
            <StatItem onClick={() => navigate(`/${profileUser.username}/followers`)}>
              <span>{followersCountQuery.data}</span> Followers
            </StatItem>
            <StatItem onClick={() => navigate(`/${profileUser.username}/following`)}>
              <span>{followingCountQuery.data}</span> Following
            </StatItem>
          </StatsContainer>
        </ProfileInfo>
      </ProfileContainer>
      <PostList mode="profile" profileUserId={profileUser.id} pageScrollRef={pageScrollRef} />
    </>
  );
};

export default Profile;
