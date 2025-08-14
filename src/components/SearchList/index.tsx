// src/components/SearchList/index.tsx

import { useState } from 'react';
import { IUser } from '../../types';
import { IHashtag } from '../../api/hashtagApi';
import { useNavigate } from 'react-router-dom';

// Importar componentes estilizados do UserList
import {
  List as UserListContainer,
  Item as UserListItem,
  Avatar as UserAvatarComponent,
  UserInfo as UserInfoComponent,
  UserName as UserNameComponent,
  UserHandle as UserHandleComponent,
} from '../UserList/styles';

import {
  SearchListContainer,
  TabContainer,
  TabButton,
  ResultsContainer,
  HashtagList, // ul para as hashtags
  HashtagItem, // li para cada hashtag
} from "./styles"

interface SearchListProps {
  users: IUser[];
  hashtags: IHashtag[];
}

const SearchList = ({ users, hashtags }: SearchListProps) => {
  const [activeTab, setActiveTab] = useState<'users' | 'hashtags'>('users');
  const navigate = useNavigate();

  const handleUserClick = (username: string) => {
    navigate(`/${username}`);
  };

  return (
    <SearchListContainer> {/* Usando o novo container geral para o SearchList */}
      <TabContainer>
        <TabButton $isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users
        </TabButton>
        <TabButton $isActive={activeTab === 'hashtags'} onClick={() => setActiveTab('hashtags')}>
          #Hashtags
        </TabButton>
      </TabContainer>

      <ResultsContainer>
        {activeTab === 'users' && (
          <>
            {users.length > 0 ? (
              <UserListContainer>
                {users.map((user: IUser) => (
                  <UserListItem key={user.id} onClick={() => handleUserClick(user.username)}>
                    <UserAvatarComponent src={user.profile_picture || "/default-avatar.png"} alt={user.username} />
                    <UserInfoComponent>
                      <UserNameComponent>{user.firstName} {user.lastName}</UserNameComponent>
                      <UserHandleComponent>@{user.username}</UserHandleComponent>
                    </UserInfoComponent>
                  </UserListItem>
                ))}
              </UserListContainer>
            ) : (
              <p style={{ fontStyle: "italic", textAlign: "center", padding: "1rem" }}>No users found.</p>
            )}
          </>
        )}

        {activeTab === 'hashtags' && (
          <>
            {hashtags.length > 0 ? (
              <HashtagList>
                {hashtags.map((hashtag: IHashtag) => (
                  <HashtagItem key={hashtag.id}>
                    <strong>#{hashtag.name}</strong>
                  </HashtagItem>
                ))}
              </HashtagList>
            ) : (
              <p style={{ fontStyle: "italic", textAlign: "center", padding: "1rem" }}>No #hashtags found.</p>
            )}
          </>
        )}
      </ResultsContainer>
    </SearchListContainer>
  );
};

export default SearchList;
