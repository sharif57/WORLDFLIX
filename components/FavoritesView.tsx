"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { ChannelGrid } from "./ChannelGrid";
import { useAppStore } from "@/lib/store";
import type { ChannelWithMeta } from "@/lib/types";

interface FavoritesViewProps {
  allChannels: ChannelWithMeta[];
}

export function FavoritesView({ allChannels }: FavoritesViewProps) {
  const favorites = useAppStore((s) => s.favorites);

  const favoriteChannels = useMemo(
    () => allChannels.filter((ch) => favorites.includes(ch.id)),
    [allChannels, favorites]
  );

  if (favoriteChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">No Favorites Yet</h2>
        <p className="text-muted-foreground max-w-sm">
          Click the heart icon on any channel to add it to your favorites. They will appear here for quick access.
        </p>
      </div>
    );
  }

  return (
    <ChannelGrid
      channels={favoriteChannels}
      title="My Favorites"
      showLoadMore={false}
    />
  );
}
