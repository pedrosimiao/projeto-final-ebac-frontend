// src/components/Sidebar/index.tsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";


import { useCurrentUserProfile } from "../../hooks/useUsers";
import { useNotifications } from "../../hooks/useNotifications";

import {
  SidebarContainer,
  InnerContainer,
  LogoWrapper,
  NavList,
  NavItem,
  PostButtonContainer,
  PostButton,
  MobilePostButton,
  NotificationBadge,
  BellWrapper,
} from "./styles";

import Logo from "../Logo";

import { FaHome, FaSearch, FaBell, FaRegKiss, FaEllipsisH, FaPlus, FaFeatherAlt } from "react-icons/fa";

const Sidebar = () => {
  const { data: currentUser } = useCurrentUserProfile();

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 460 });

  const { notifications } = useNotifications();

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handlePostClick = () => {
  navigate("/compose/post", {
    state: { background: location },
  });
};

  return (
    <SidebarContainer>
      <InnerContainer>

        <LogoWrapper>
          <Logo width="120px" height="auto" />
        </LogoWrapper>

        <NavList>
          <NavItem>
            <Link to="/">
              <FaHome />
              <span>Home</span>
            </Link>
          </NavItem>

          <NavItem>
            <Link to="/explore">
              <FaSearch />
              <span>Explore</span>
            </Link>
          </NavItem>

          <NavItem>
            <Link to="/notifications">
              <BellWrapper>
                <FaBell />
                {unreadCount > 0 && (
                  <NotificationBadge>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </NotificationBadge>
                )}
              </BellWrapper>
              <span>Notifications</span>
            </Link>
          </NavItem>

          <NavItem>
            <Link to={currentUser ? `/${currentUser.username}` : "/login"}>
              <FaRegKiss />
              <span>Profile</span>
            </Link>
          </NavItem>

          <NavItem>
            <Link to="/settings">
              <FaEllipsisH />
              <span>Settings</span>
            </Link>
          </NavItem>
        </NavList>

        <PostButtonContainer>
          <PostButton onClick={handlePostClick}>
            <FaPlus />
            <span>Post</span>
          </PostButton>
        </PostButtonContainer>

        {isMobile && (
          <MobilePostButton
            onClick={handlePostClick}
          >
            <FaFeatherAlt size={24} />
          </MobilePostButton>
        )}

      </InnerContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
