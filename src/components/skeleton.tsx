"use client"

import React from 'react';
import { GlassCard, GlassCardVariant } from "@/lib/components";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "w-full",
  height = "h-4",
  rounded = "rounded"
}) => {
  return (
    <div
      className={`${width} ${height} ${rounded} bg-white/10 animate-pulse ${className}`}
    />
  );
};

// Predefined skeleton components
export const SkeletonText = ({ lines = 1, className = "" }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="h-4"
        width={i === lines - 1 ? "w-3/4" : "w-full"}
        className="rounded"
      />
    ))}
  </div>
);

export const SkeletonTitle = ({ className = "" }: { className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    <Skeleton height="h-8" width="w-3/4" className="rounded-lg" />
    <Skeleton height="h-1" width="w-24" className="rounded-full" />
  </div>
);

export const SkeletonButton = ({ width = "w-28", className = "" }: { width?: string; className?: string }) => (
  <Skeleton
    height="h-10"
    width={width}
    className={`bg-white/10 rounded-xl ${className}`}
  />
);

export const SkeletonButtons = ({ count = 3, className = "" }: { count?: number; className?: string }) => (
  <div className={`flex gap-3 items-center ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonButton
        key={i}
        width={i === 0 ? "w-28" : "w-10"}
      />
    ))}
  </div>
);

export const SkeletonStatCard = ({ className = "" }: { className?: string }) => (
  <GlassCard variant="sm" className={className}>
    <Skeleton
      height="h-4"
      width="w-16"
      className="mb-2 bg-white/10 rounded"
    />
    <Skeleton
      height="h-8"
      width="w-20"
      className="bg-white/10 rounded-lg"
    />
  </GlassCard>
);

export const SkeletonStatCards = ({ count = 3, className = "" }: { count?: number; className?: string }) => (
  <div className={`grid grid-cols-3 gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStatCard key={i} />
    ))}
  </div>
);

export const SkeletonUserDetails = ({ count = 3, className = "" }: { count?: number; className?: string }) => (
  <div className={`flex flex-wrap gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        height="h-5"
        width={i === 0 ? "w-32" : i === 1 ? "w-28" : "w-36"}
        className="bg-white/10 rounded"
      />
    ))}
  </div>
);

export const SkeletonSkills = ({ count = 6, className = "" }: { count?: number; className?: string }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        height="h-8"
        width="w-32"
        rounded="rounded-full"
        className="bg-white/10"
      />
    ))}
  </div>
);

export const SkeletonPostGrid = ({ count = 6, className = "" }: { count?: number; className?: string }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="relative w-full h-64">
        <Skeleton
          height="h-full"
          className="rounded-2xl bg-white/10"
          width="w-full"
        />
      </div>
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = "h-40", className = "" }: { size?: string; className?: string }) => (
  <Skeleton
    height={size}
    width={size.replace("h-", "w-")}
    rounded="rounded-full"
    className={`bg-white/10 ring-4 ring-white/20 ${className}`}
  />
);

export const SkeletonUserInfo = ({ className = "" }: { className?: string }) => (
  <div className={className}>
    <Skeleton
      height="h-9"
      width="w-48"
      className="mb-2 bg-white/10 rounded-lg"
    />
    <Skeleton
      height="h-6"
      width="w-32"
      className="bg-white/10 rounded"
    />
  </div>
);

// Profile Skeleton Component
export const ProfileSkeleton = () => (
  <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    {/* Back button skeleton */}
    <div className="mb-4">
      <Skeleton
        width="w-24"
        height="h-9"
        className="rounded-xl bg-white/5"
      />
    </div>

    {/* Cover Photo Skeleton */}
    <GlassCard variant="lg" className="h-72 md:h-96 rounded-3xl overflow-hidden mb-0 p-0 border-none shadow-none">
      <div className="w-full h-full bg-linear-to-b from-white/10 to-transparent animate-pulse" />
    </GlassCard>

    {/* Profile Header Section Skeleton - Exactly matching ProfileContent layout */}
    <GlassCardVariant className="relative -mt-37 md:-mt-57 mb-8 p-4 md:p-8 !rounded-b-3xl !overflow-visible">
      <div className="flex flex-row items-end gap-4 md:gap-6">
        {/* Avatar Skeleton */}
        <div className="shrink-0">
          <div className="h-20 w-20 md:h-40 md:w-40 rounded-full bg-white/10 animate-pulse ring-4 ring-white/10 shadow-2xl" />
        </div>

        {/* User Info Skeleton */}
        <div className="flex-1 text-left pb-2">
          <div className="mb-3 md:mb-4 space-y-2.5">
            <div className="h-7 md:h-10 w-32 md:w-56 bg-white/15 rounded-xl animate-pulse" />
            <div className="h-4 md:h-6 w-24 md:w-36 bg-white/10 rounded-lg animate-pulse" />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <div className="h-9 md:h-11 w-28 md:w-36 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-9 md:h-11 w-9 md:w-11 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-9 md:h-11 w-9 md:w-11 bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </GlassCardVariant>

    {/* Information Section Skeleton */}
    <GlassCard variant="lg" className="mb-8">
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="h-7 w-36 bg-white/15 rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 rounded-full animate-pulse" />
            <div className="h-4 w-5/6 bg-white/5 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div className="h-9 w-44 bg-white/5 border border-white/5 rounded-full animate-pulse" />
          <div className="h-9 w-36 bg-white/5 border border-white/5 rounded-full animate-pulse" />
          <div className="h-9 w-32 bg-white/5 border border-white/5 rounded-full animate-pulse" />
        </div>
      </div>
    </GlassCard>

    {/* Stats Section Skeleton */}
    <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
      <div className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse shadow-xl shadow-black/10" />
      <div className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse shadow-xl shadow-black/10" />
      <div className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse shadow-xl shadow-black/10" />
    </div>

    {/* Tabs Section Skeleton */}
    <div className="mb-8 border-b border-white/10 flex items-center gap-8">
      <div className="pb-4 relative">
        <div className="h-5 w-20 bg-white/15 rounded-lg animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary/50" />
      </div>
      <div className="pb-4">
        <div className="h-5 w-20 bg-white/10 rounded-lg animate-pulse" />
      </div>
    </div>

    {/* Content Grid Skeleton (Default for Posts) */}
    <div className="grid grid-cols-3 gap-0.5 md:gap-4 mb-12">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="aspect-[3/4] bg-white/5 rounded-sm md:rounded-2xl border border-white/5 animate-pulse" />
      ))}
    </div>
  </div>
);

export const SkeletonFriendRequests = ({ count = 3, className = "" }: { count?: number; className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton height="h-8" width="w-8" rounded="rounded-full" />
          <div className="flex-1">
            <Skeleton height="h-4" width="w-24" className="mb-2" />
            <Skeleton height="h-3" width="w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton height="h-8" width="w-full" className="rounded-lg" />
          <Skeleton height="h-8" width="w-full" className="rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonStoryItem = ({ className = "" }: { className?: string }) => (
  <div className={`flex-shrink-0 ${className}`}>
    <Skeleton
      height="h-24"
      width="w-20"
      rounded="rounded-lg"
      className="bg-white/10"
    />
    <div className="mt-2 flex items-center justify-center">
      <Skeleton
        height="h-6"
        width="w-6"
        rounded="rounded-full"
        className="bg-white/10"
      />
    </div>
    <Skeleton
      height="h-3"
      width="w-16"
      className="mt-1 mx-auto bg-white/10 rounded"
    />
  </div>
);

export const SkeletonStories = ({ count = 5, className = "" }: { count?: number; className?: string }) => (
  <div className={`flex gap-3 overflow-x-auto pb-2 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStoryItem key={i} />
    ))}
  </div>
);

// Inner part of the story skeleton (without the full-screen backdrop)
export const StorySkeletonContent = () => (
  <div
    className="relative bg-black rounded-3xl overflow-hidden shadow-2xl w-full h-full"
    style={{
      height: '100%',
      aspectRatio: '9/16',
      maxHeight: '100%'
    }}
  >
    {/* Main content skeleton */}
    <Skeleton
      height="h-full"
      className="rounded-3xl bg-white/10"
      width="w-full"
    />

    {/* Header skeleton */}
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <Skeleton
          height="h-8"
          width="w-8"
          rounded="rounded-full"
          className="bg-white/20 ring-2 ring-white/50"
        />
        <div className="space-y-2">
          <Skeleton
            height="h-4"
            width="w-24"
            className="bg-white/20 rounded"
          />
          <Skeleton
            height="h-3"
            width="w-20"
            className="bg-white/15 rounded"
          />
        </div>
      </div>
      <Skeleton
        height="h-8"
        width="w-8"
        rounded="rounded-full"
        className="bg-white/20"
      />
    </div>

    {/* Progress bars skeleton */}
    <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 h-1 z-10">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton
          key={i}
          height="h-0.5"
          width="w-full"
          className="bg-white/20 rounded-full"
        />
      ))}
    </div>

    {/* Navigation buttons skeleton */}
    <div className="absolute left-4 top-1/2 -translate-y-1/2">
      <Skeleton
        height="h-12"
        width="w-12"
        rounded="rounded-full"
        className="bg-white/20"
      />
    </div>
    <div className="absolute right-4 top-1/2 -translate-y-1/2">
      <Skeleton
        height="h-12"
        width="w-12"
        rounded="rounded-full"
        className="bg-white/20"
      />
    </div>
  </div>
);

// Story Page Skeleton Component
export const StorySkeleton = () => (
  <div
    className="relative w-full h-full bg-black/80 flex items-center justify-center"
    style={{
      width: '100%',
      height: '100%'
    }}
  >
    <div
      style={{
        height: '100%',
        aspectRatio: '9/16',
        maxHeight: '100%'
      }}
    >
      <StorySkeletonContent />
    </div>
  </div>
);

export const SkeletonPostCard = ({ className = "" }: { className?: string }) => (
  <div className={`backdrop-blur-3xl bg-white/6 border border-white/20 rounded-2xl shadow-xl overflow-hidden mb-4 ${className}`}>
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        <Skeleton width="w-12" height="h-12" rounded="rounded-full" />
        <div className="space-y-2">
          <Skeleton width="w-32" height="h-4" rounded="rounded" />
          <Skeleton width="w-20" height="h-3" rounded="rounded" />
        </div>
      </div>
      <Skeleton width="w-8" height="h-8" rounded="rounded-lg" />
    </div>

    {/* Content */}
    <div className="p-4">
      <SkeletonText lines={2} className="mb-4" />

      {/* Media */}
      <Skeleton width="w-full" height="h-64" className="rounded-xl" />
    </div>

    {/* Stats */}
    <div className="flex items-center justify-between px-4 py-2 border-t border-b border-white/10">
      <Skeleton height="h-3" width="w-16" />
      <Skeleton height="h-3" width="w-16" />
      <Skeleton height="h-3" width="w-16" />
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2 p-4">
      <Skeleton height="h-10" width="w-full" className="flex-1 rounded-lg" />
      <Skeleton height="h-10" width="w-full" className="flex-1 rounded-lg" />
      <Skeleton height="h-10" width="w-full" className="flex-1 rounded-lg" />
    </div>
  </div>
);

export const SkeletonFeed = ({ count = 3 }: { count?: number }) => (
  <div className="w-full">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonPostCard key={i} />
    ))}
  </div>
);

export const SkeletonComment = ({ className = "" }: { className?: string }) => (
  <div className={`flex gap-3 relative z-10 ${className}`}>
    <Skeleton width="w-9" height="h-9" rounded="rounded-full" className="bg-white/10 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 inline-block min-w-[200px]">
        <div className="flex items-center justify-between mb-2 gap-4">
          <Skeleton width="w-24" height="h-4" rounded="rounded" className="bg-white/10" />
        </div>
        <Skeleton width="w-48" height="h-3" rounded="rounded" className="bg-white/10 mb-1" />
        <Skeleton width="w-32" height="h-3" rounded="rounded" className="bg-white/10" />
      </div>
      <div className="flex items-center gap-1 mt-1 ml-1 select-none">
        <Skeleton width="w-8" height="h-3" rounded="rounded" className="bg-white/10" />
        <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
        <Skeleton width="w-8" height="h-3" rounded="rounded" className="bg-white/10" />
        <div className="w-0.5 h-0.5 rounded-full bg-white/20" />
        <Skeleton width="w-6" height="h-3" rounded="rounded" className="bg-white/10 ml-2" />
      </div>
    </div>
  </div>
);

export const SkeletonComments = ({ count = 3, className = "" }: { count?: number; className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonComment key={i} />
    ))}
  </div>
);

export const SkeletonConversationItem = ({ className = "" }: { className?: string }) => (
  <div className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5 animate-pulse ${className}`}>
    <Skeleton width="w-12" height="h-12" rounded="rounded-full" className="bg-white/10 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton width="w-32" height="h-4" rounded="rounded" className="bg-white/10" />
        <Skeleton width="w-10" height="h-3" rounded="rounded" className="bg-white/10" />
      </div>
      <Skeleton width="w-4/5" height="h-3" rounded="rounded" className="bg-white/5" />
    </div>
  </div>
);

export const SkeletonConversationList = ({ count = 10, className = "" }: { count?: number; className?: string }) => (
  <div className={`space-y-1.5 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonConversationItem key={i} />
    ))}
  </div>
);

export const SkeletonSettingsRow = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl animate-pulse ${className}`}>
    <div className="flex items-center gap-4 min-w-0">
      <Skeleton width="w-9" height="h-9" className="rounded-lg bg-brand-primary/5" />
      <div className="min-w-0 space-y-1.5">
        <Skeleton width="w-12" height="h-3" className="bg-white/5 rounded" />
        <Skeleton width="w-32" height="h-4" className="bg-white/10 rounded" />
      </div>
    </div>
    <Skeleton width="w-5" height="h-5" className="bg-white/5 rounded-full" />
  </div>
);

export const SkeletonSettingsList = ({ count = 3, className = "" }: { count?: number; className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonSettingsRow key={i} />
    ))}
  </div>
);
// Reel Page Skeleton Component
// Reel Page Skeleton Component
export const ReelSkeleton = () => (
  <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-transparent">
    {/* Shimmer Animation Keyframes */}
    <style jsx global>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .shimmer {
        position: relative;
        overflow: hidden;
      }
      .shimmer::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.05) 50%,
          transparent 100%
        );
        animation: shimmer 2s infinite;
      }
    `}</style>

    <div className="flex w-full h-full max-w-full justify-center relative z-10 sm:py-6">
      <div className="relative w-full h-full sm:max-w-[420px] md:max-w-[480px] lg:max-w-[550px] sm:rounded-[2.5rem] overflow-hidden bg-white/5 backdrop-blur-3xl flex items-center justify-center z-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex-shrink-0 shimmer">

        {/* Overlay để làm tối phần dưới cho text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Bottom Info Section */}
        <div className="absolute bottom-10 left-6 right-20 z-20 space-y-5">
          {/* User profile & Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 ring-1 ring-white/20" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/20 rounded-full" />
              <div className="h-3 w-20 bg-white/10 rounded-full" />
            </div>
            <div className="ml-2 h-8 w-20 bg-white/10 rounded-xl border border-white/10" />
          </div>

          {/* Caption area */}
          <div className="space-y-2.5">
            <div className="h-3.5 w-full bg-white/15 rounded-full" />
            <div className="h-3.5 w-4/5 bg-white/10 rounded-full" />
          </div>

          {/* Music track simulation */}
          <div className="flex items-center gap-2 pt-2">
            <div className="w-5 h-5 rounded-full bg-white/20 animate-spin-slow" />
            <div className="h-6 w-40 bg-white/10 rounded-full backdrop-blur-md border border-white/5" />
          </div>
        </div>

        {/* Vertical Actions (Like, Comment, Share) */}
        <div className="absolute right-4 bottom-12 flex flex-col items-center gap-8 z-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white/20 rounded-full" />
              </div>
              <div className="h-2.5 w-6 bg-white/20 rounded-full" />
            </div>
          ))}

          {/* User avatar small circle at the very bottom */}
          <div className="w-12 h-12 rounded-full p-0.5 bg-white/10 border border-white/20 mt-2">
            <div className="w-full h-full rounded-full bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Top Control Icons (Mute/Info) */}
        <div className="absolute top-8 right-6 flex items-center gap-4 z-20">
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10" />
        </div>

        <div className="absolute top-8 left-6 z-20">
          <div className="h-5 w-20 bg-white/10 rounded-full backdrop-blur-md border border-white/5" />
        </div>
      </div>
    </div>
  </div>
);
