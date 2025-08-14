// src/components/PostInput/index.tsx

import { Mention } from "primereact/mention";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import imageCompression from 'browser-image-compression';

import { useQueryClient } from "@tanstack/react-query";

import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store/store";

import {
  useCurrentUserProfile,
  useUsersForMention,
  useInitialUsersForMentionSuggestion
} from "../../hooks/useUsers";

import {
  HASHTAG_KEYS,
  useHashtagsForMention,
  useInitialHashtagsForMentionSuggestion
} from "../../hooks/useHashtags";

import { useCreatePost } from "../../hooks/usePosts";
import { useCreateComment } from "../../hooks/useComments";

import { clearParentComment } from "../../store/slices/replySlice";
import { clearRetweetPost } from "../../store/slices/retweetSlice";

import { IComment, IPost, IUser } from "../../types";

// import useClickOutside from "../../hooks/useClickOutside";

import { parsePostText } from "../../utils/parsePostText";

import defaultAvatar from "../../assets/default-avatar.png"

import { FaImage, FaRegLaugh, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

import {
  PostInputContainer,
  UserAvatar,
  MediaActions,
  ActionButton,
  PostButton,
  MediaPreview,
  EmojiPickerContainer,
  EmojiWrapper,
  CloseButton,
  TrendItem,
  SuggestionItem,
  SuggestionImage,
  SuggestionText,
  RepliedToLabel,
  RetweetPreviewContainer,
  RetweetHeader,
  RetweetAvatar,
  RetweetUserInfo,
  RetweetContent,
  RetweetMedia,
  RetweetFooter,
  CancelRetweetButton,
} from "./styles";

export type Suggestion = IUser | string;

interface PostInputProps {
  isComment?: boolean;
  postId?: string;
  parentComment?: IComment | null;
  isInModal?: boolean;
  onPostSuccess?: (id: string, type: 'post' | 'comment') => void;
}

const PostInput = ({ isComment, postId, parentComment, isInModal, onPostSuccess }: PostInputProps) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUserProfile(true);
  const userAvatar = currentUser?.profile_picture || defaultAvatar;

  const { createPost } = useCreatePost();
  const { createComment } = useCreateComment();

  const [text, setText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [compressedMedia, setCompressedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [mentionQuery, setMentionQuery] = useState("");
  const [hashtagQuery, setHashtagQuery] = useState("");

  const [activeTrigger, setActiveTrigger] = useState<"@" | "#" | null>(null);

  const { data: usersForMention = [] } = useUsersForMention(mentionQuery);
  const { data: hashtagsForMention = [] } = useHashtagsForMention(hashtagQuery);

  const { data: initialUsersSuggestions = [] } = useInitialUsersForMentionSuggestion();
  const { data: initialHashtagSuggestions = [] } = useInitialHashtagsForMentionSuggestion();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const retweetPost = useSelector((state: RootState) => state.retweet.targetPost);
  const canUploadMedia = !retweetPost;

  useEffect(() => {
    return () => {
      if (isComment) {
        dispatch(clearParentComment());
      }
    };
  }, [dispatch, isComment]);


  // useClickOutside(emojiPickerRef as React.RefObject<HTMLElement>, () => setShowEmojiPicker(false));

  // onSearch: trigger "@" filtra usuários, "#" extrai trends
  const onMultipleSearch = useCallback((e: { query: string; trigger: string }) => {
    setActiveTrigger(e.trigger as "@" | "#");

    if (e.trigger === "@") {
      setMentionQuery(e.query);
      setHashtagQuery("");
    } else if (e.trigger === "#") {
      setHashtagQuery(e.query);
      setMentionQuery("");
    }
  }, []);


  // Update sugestões com base no trigger e na query
  useEffect(() => {
    if (activeTrigger === "@") {
      setSuggestions(mentionQuery ? usersForMention : initialUsersSuggestions);

    } else if (activeTrigger === "#") {
      setSuggestions(
        hashtagQuery
          ? hashtagsForMention.map(h => `#${h.name}`)
          : initialHashtagSuggestions.map(h => `#${h.name}`)
      );

    } else {
      setSuggestions([]);
    }
  }, [
    usersForMention,
    mentionQuery,
    hashtagsForMention,
    hashtagQuery,
    activeTrigger,
    initialUsersSuggestions,
    initialHashtagSuggestions,
  ]);



  const multipleItemTemplate = (item: Suggestion) => {
    if (typeof item === "string") {
      return <TrendItem>{item}</TrendItem>;
    }
    return (
      <SuggestionItem>
        <SuggestionImage src={item.profile_picture || "/default-avatar.png"} alt={item.username} />
        <SuggestionText>
          <span>{`${item.firstName} ${item.lastName}`}</span>
          <small>@{item.username}</small>
        </SuggestionText>
      </SuggestionItem>
    );
  };


  // lógica do input de postagem (limita caractéres & ajusta tamanho da textarea)
  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inputElement = event.target as HTMLInputElement;
    const newText = inputElement.value;

    if (newText.length <= 280) {
      setText(newText);

      const textarea = document.getElementById("post-input-textarea") as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "2.5rem";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }

    // Se o texto for limpo e o gatilho sumir, resetar activeTrigger e queries
    if (!newText.includes('@') && !newText.includes('#') && activeTrigger !== null) {
      setActiveTrigger(null);
      setMentionQuery('');
      setHashtagQuery('');
    }
  };


  // lógica de previews de imagem c/ compressão de imagem
  const handleImageChange = useCallback(
    async (file: File | null) => {
      if (file && file.type.startsWith("image/")) {
        const originalName = file.name;

        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        try {
          const compressedImage = await imageCompression(file, options);
          const newCompressedFile = new File([compressedImage], originalName, { type: compressedImage.type });
          setCompressedMedia(newCompressedFile);
          setMediaPreview(URL.createObjectURL(newCompressedFile));
        } catch (error) {
          console.error('Error compressing image:', error);
          setCompressedMedia(file);
          setMediaPreview(URL.createObjectURL(file));
        }

      } else if (file) {
        setCompressedMedia(file);
        setMediaPreview(URL.createObjectURL(file));

      } else {
        setCompressedMedia(null);
        setMediaPreview(null);
      }
    },
    []
  );

  // recebe o arquivo selecionado no botão de upload de mídia
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUploadMedia) return;
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      handleImageChange(file);
    } else {
      setMedia(null);
      setCompressedMedia(null);
      setMediaPreview(null);
    }
  };

  // remove o arquivo selecionado pelo usuário do preview de mídia
  const handleRemoveMedia = () => {
    setMedia(null);
    setCompressedMedia(null);
    setMediaPreview(null);
  };


  // recebe o emoji do emoji-picker-react, adiciona ao texto do post e garante o ajuste tamanho da textarea
  const handleEmojiClick = (emoji: EmojiClickData) => {
    const newText = text + emoji.emoji;
    setText(newText);

    setTimeout(() => {
      const textarea = document.getElementById("post-input-textarea") as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "2.5rem";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, 0);
  };

  // Create new Post | Comment
  const handlePost = () => {
    if (isCurrentUserLoading || !currentUser) {
      console.warn("Attempted to post before current user data was loaded.");
      return;
    }

    const finalRetweet = retweetPost ?? undefined;
    if (!finalRetweet && text?.trim() === "" && !compressedMedia) return;

    const formData = new FormData();

    formData.append("content", text);

    if (compressedMedia) {
      if (compressedMedia.type.startsWith("image/")) {
        formData.append("image", compressedMedia);
      } else if (compressedMedia.type.startsWith("video/")) {
        formData.append("video", compressedMedia);
      }
    }

    if (finalRetweet) formData.append("retweet_id", finalRetweet.id);

    const onSuccessCallback = (data: IPost | IComment) => {
      queryClient.invalidateQueries({ queryKey: HASHTAG_KEYS.all });
      setText("");
      setMedia(null);
      setCompressedMedia(null);
      setMediaPreview(null);

      if (isComment && postId) { // case comentário raiz para um post específico (via PostModal)
        onPostSuccess?.(data.id, 'comment'); // data.id: id do comentário
      } else { // post novo
        onPostSuccess?.(data.id, 'post'); // data.id: id do post
      };

      dispatch(clearRetweetPost());

      if (isComment) {
        dispatch(clearParentComment());
      }
    };

    if (isComment && postId) {
      formData.append("post", postId);

      if (parentComment) {
        formData.append("parent_comment", parentComment.id);
      }

      createComment(formData, { onSuccess: onSuccessCallback });

    } else {
      createPost(formData, { onSuccess: onSuccessCallback });
    }
  };


  return (
    <PostInputContainer $isComment={isComment} $isInModal={isInModal}>
      <UserAvatar src={userAvatar} alt="User Avatar" $isComment={isComment} />

      {isComment && parentComment && (
        <RepliedToLabel>
          Replying to @{parentComment.user.username}
          <FaTrash onClick={() => dispatch(clearParentComment())}/>
        </RepliedToLabel>
      )}

      <Mention
        value={text}
        onInput={handleInputChange}
        onChange={handleInputChange}
        trigger={["@", "#"]}
        suggestions={suggestions}
        onSearch={onMultipleSearch}
        // field={["username"]}
        field={typeof suggestions[0] === 'string' ? undefined : "username"} // Ajuste de field dinamico
        placeholder={isComment ? "Post your reply" : "What's happening?"}
        itemTemplate={multipleItemTemplate}
        autoHighlight={false}
        inputClassName={`
          ${isComment ? "custom-mentions-reply-input" : "custom-mentions-input"}
          ${isInModal ? "in-modal" : ""}
        `}
        panelClassName="custom-mention-panel"
        autoResize
      />

      {retweetPost && (
        <RetweetPreviewContainer>
          <CancelRetweetButton onClick={() => dispatch(clearRetweetPost())}>
            <FaTrash />
          </CancelRetweetButton>

          <RetweetHeader>
            <RetweetAvatar src={retweetPost.user.profile_picture || "/default-avatar.png"} />
            <RetweetUserInfo>
              <h4>{retweetPost.user.firstName} {retweetPost.user.lastName}</h4>
              <p>@{retweetPost.user.username}</p>
            </RetweetUserInfo>
          </RetweetHeader>

          <RetweetContent>{parsePostText(retweetPost.content?.toString())}</RetweetContent>

          <RetweetMedia>
            {retweetPost.image && <img src={retweetPost.image} alt="Retweet image" />}
            {retweetPost.video && <video src={retweetPost.video} controls />}
          </RetweetMedia>

          <RetweetFooter><div></div></RetweetFooter>
        </RetweetPreviewContainer>
      )}

      {mediaPreview && ( // Usando mediaPreview aqui
        <div style={{ position: "relative" }}>
          <MediaPreview $isComment={isComment} $isInModal={isInModal}>
            {media?.type?.startsWith("image/") ? (
              <img src={mediaPreview} alt="Preview" />
            ) : media?.type?.startsWith("video/") ? (
              <video src={mediaPreview} controls />
            ) : null}
          </MediaPreview>
          <CloseButton onClick={handleRemoveMedia}>
            <AiOutlineClose size={18} />
          </CloseButton>
        </div>
      )}

      {/* Input de upload oculto */}
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleMediaUpload}
      />

      <MediaActions $isComment={isComment}>
        {canUploadMedia && (
          <ActionButton $isInModal={isInModal} onClick={() => fileInputRef.current?.click()}>
            <FaImage />
          </ActionButton>
        )}

        {/* Emoji picker */}
        <EmojiWrapper>
          <ActionButton
            $isInModal={isInModal}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaRegLaugh />
          </ActionButton>
          {showEmojiPicker && (
            <EmojiPickerContainer ref={emojiPickerRef}>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
                theme={Theme.DARK}
                emojiStyle={EmojiStyle.TWITTER}
                lazyLoadEmojis
                previewConfig={{ showPreview: false }}
                searchDisabled={true}
              />
            </EmojiPickerContainer>
          )}
        </EmojiWrapper>
      </MediaActions>

      <PostButton
        $isInModal={isInModal}
        onClick={handlePost}
        disabled={isCurrentUserLoading || (text.trim() === "" && !compressedMedia && !retweetPost)}
        >
          {isComment ? "Reply" : "Post"}
        </PostButton>
    </PostInputContainer>
  );
};

export default PostInput;
