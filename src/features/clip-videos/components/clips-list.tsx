"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { useClips } from "@/hooks/use-clips";
import { formatDistanceToNow } from "date-fns";
import {
  Scissors,
  Film,
  Calendar,
  Layers,
  ChevronRight,
  Video,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Clip = {
  id: string;
  video_name: string;
  clips_count: number;
  created_at: string | Date;
  video_id?: string | null;
};

function ClipSkeleton() {
  return (
    <div className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03]">
      <Skeleton className="size-16 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-5 w-52 rounded-md" />
        <Skeleton className="h-3.5 w-32 rounded-md" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="size-5 rounded" />
    </div>
  );
}

function ClipCard({ clip }: { clip: Clip }) {
  const createdAt =
    typeof clip.created_at === "string"
      ? new Date(clip.created_at)
      : clip.created_at;

  return (
    <Link
      href={`/clips/${clip.id}`}
      className="group flex items-center gap-5 w-full p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
    >
      {/* Big icon */}
      <div className="size-16 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 group-hover:bg-yellow-400/15 transition-colors">
        <Scissors className="size-8 text-yellow-400" strokeWidth={1.25} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-base text-white truncate tracking-tight">
          {clip.video_name}
        </h2>

        <p className="flex items-center gap-1.5 text-xs text-white/40 mt-1">
          {clip.video_id ? (
            <>
              <Video size={12} />
              Linked to video
            </>
          ) : (
            <>
              <Film size={12} />
              No source video
            </>
          )}
        </p>

        <div className="flex flex-wrap gap-2 mt-2.5">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs font-normal bg-white/5 text-white/50 border border-white/[0.08] rounded-full px-2.5 py-0.5"
          >
            <Layers size={11} />
            {clip.clips_count} {clip.clips_count === 1 ? "clip" : "clips"}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs font-normal bg-white/5 text-white/50 border border-white/[0.08] rounded-full px-2.5 py-0.5"
          >
            <Clock size={11} />
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs font-normal bg-white/5 text-white/50 border border-white/[0.08] rounded-full px-2.5 py-0.5"
          >
            <Calendar size={11} />
            {createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        className="size-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0"
        strokeWidth={1.5}
      />
    </Link>
  );
}

export default function ClipsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useClips();

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const clips = data?.pages.flatMap((p) => p.clips) ?? [];
  const totalCount = data?.pages[0]?.clips.length ?? 0;

  return (
    <div className="flex-1 ">
      <main className=" mx-auto px-6 py-14">


        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/30">
            <Film size={48} strokeWidth={1} />
            <p className="text-sm">Failed to load clips. Please try again.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && clips.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Scissors size={64} strokeWidth={0.75} className="text-white/10" />
            <p className="text-base font-medium text-white/30">No clips yet</p>
            <p className="text-sm text-white/20">
              Your clips will appear here once created.
            </p>
          </div>
        )}

        {/* List */}
        <div className="flex flex-col w-full gap-2">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ClipSkeleton key={i} />)
            : clips.map((clip) => <ClipCard key={clip.id} clip={clip} />)}
        </div>

        {/* Sentinel / load more */}
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-sm text-white/30">
              <Loader2 size={16} className="animate-spin" />
              Loading more…
            </div>
          )}
          {!isLoading && !hasNextPage && clips.length > 0 && (
            <p className="text-xs text-white/20 tracking-widest">
              · END OF LIBRARY ·
            </p>
          )}
        </div>

      </main>
    </div>
  );
}