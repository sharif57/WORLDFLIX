"use client";

import { useState, useCallback, useMemo } from "react";
import { ChannelCard } from "./ChannelCard";
import { ChannelCardSkeleton } from "./ChannelCardSkeleton";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import type { ChannelWithMeta } from "@/lib/types";

interface ChannelGridProps {
  channels: ChannelWithMeta[];
  isLoading?: boolean;
  title?: string;
  pageSize?: number;
  showLoadMore?: boolean;
}

export function ChannelGrid({
  channels,
  isLoading,
  title,
  pageSize = 20,
  showLoadMore = true,
}: ChannelGridProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visibleChannels = useMemo(
    () => channels.slice(0, visibleCount),
    [channels, visibleCount]
  );

  const hasMore = visibleCount < channels.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + pageSize);
  }, [pageSize]);

  if (isLoading) {
    return (
      <div>
        {title && (
          <h2 className="text-xl font-bold mb-4">{title}</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ChannelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No channels found</p>
        <p className="text-muted-foreground text-sm mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            {channels.length.toLocaleString()} channels
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {visibleChannels.map((channel, i) => (
          <ChannelCard key={channel.id} channel={channel} index={i} />
        ))}
      </div>
      {showLoadMore && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            className="gap-2 border-neon/30 hover:border-neon/60 hover:bg-neon/5"
          >
            <ChevronDown className="h-4 w-4" />
            Load More ({channels.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
