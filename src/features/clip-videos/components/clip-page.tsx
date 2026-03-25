"use client";

import Link from "next/link";
import { useGetVideoClips } from "@/hooks/use-clips";
import { formatDistanceToNow } from "date-fns";
import {
  Scissors,
  Film,
  Video,
  ArrowLeft,
  Clock,
  HardDrive,
  Globe,
  Layers,
  Calendar,
  Loader2,
  MicroscopeIcon,
  HeadphonesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/features/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { VideoCard } from "@/features/videos/components/video-card";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function ClipPage(params : { id: string }) {
  const { data, isLoading, isError } = useGetVideoClips(params.id);

  const clip = data?.clip;
  const clips = data?.clips ?? [];

  return (
    <div className="min-h-screen ">
     <PageHeader name={clip?.video_name||"clip"}>
        <Button variant={"destructive"} className={"rounded-xl"}>
            <HeadphonesIcon/> Help
        </Button>
     </PageHeader>
      <main className="max-w-6xl mx-auto px-6 py-14">

        {/* Back */}
        <Link
          href="/clips"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-10"
        >
          <ArrowLeft size={15} />
          All clips
        </Link>

        {/* Header */}
        {isLoading ? (
          <div className="flex items-center gap-5 mb-10">
            <Skeleton className="size-[72px] rounded-2xl shrink-0" />
            <div className="space-y-2.5">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-5 mb-10">
            <div className="size-[72px] rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0">
              <Scissors className="size-10 text-yellow-400" strokeWidth={1} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {clip?.video_name ?? "Clip"}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-white/40 mt-1">
                {clip?.video_id ? (
                  <><Video size={13} /> Linked to video</>
                ) : (
                  <><Film size={13} /> No source video</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Meta chips */}
        {isLoading ? (
          <div className="flex gap-2 mb-10">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        ) : clip ? (
          <div className="flex flex-wrap gap-2 mb-10">
            <Badge variant="secondary" className="flex items-center gap-1.5 text-xs font-normal bg-white/5 text-white/50 border border-white/[0.08] rounded-full px-3 py-1">
              <Layers size={12} />
              {clip.clips_count} {clip.clips_count === 1 ? "clip" : "clips"}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 text-xs font-normal bg-white/5 text-white/50 border border-white/[0.08] rounded-full px-3 py-1">
              <Clock size={12} />
              {formatDistanceToNow(new Date(clip.created_at), { addSuffix: true })}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 text-xs font-normal bg-white/5 text-white/50 border border-white/[0.08] rounded-full px-3 py-1">
              <Calendar size={12} />
              {new Date(clip.created_at).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </Badge>
          </div>
        ) : null}

        <Separator className="bg-white/[0.07] mb-10" />

        {/* Clips section */}
        <div>
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
            Files · {isLoading ? "—" : clips.length}
          </h2>

          {isError && (
            <p className="text-sm text-white/30 py-10 text-center">
              Failed to load clips.
            </p>
          )}

          {!isLoading && !isError && clips.length === 0 && (
            <p className="text-sm text-white/30 py-10 text-center">
              No files attached to this clip.
            </p>
          )}

          {isLoading ? (
            <div className="space-y-px">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl">
                  <Skeleton className="size-8 rounded-lg shrink-0" />
                  <Skeleton className="h-4 w-48 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {clips.map((c) => (
              <>
              <VideoCard video={{...c,original_file_name:c.original_file_name.replaceAll("_"," ")}}/>
              </>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}