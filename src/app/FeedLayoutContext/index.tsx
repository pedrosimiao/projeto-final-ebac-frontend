// src/app/FeedLayoutContext.tsx
import { createContext } from "react";

interface FeedLayoutContextType {
  feedContainerDimensions: { left: number; width: number };
}

export const FeedLayoutContext = createContext<FeedLayoutContextType>({
  feedContainerDimensions: { left: 0, width: 0 },
});