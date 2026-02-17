"use client"

import React from 'react';
import { GlassCard } from "@/lib/components";

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
  <>
    {/* Cover Photo Skeleton */}
    <GlassCard variant="lg" className="h-48 md:h-64 rounded-3xl overflow-hidden mb-0">
      <Skeleton 
        height="h-full" 
        className="rounded-3xl bg-white/10" 
        width="w-full"
      />
    </GlassCard>

    {/* Profile Header Section Skeleton */}
    <GlassCard className="relative -mt-20 mb-8 p-8">
      <div className="flex flex-col md:flex-row md:items-end gap-6">
        {/* Avatar Skeleton */}
        <div className="shrink-0">
          <SkeletonAvatar />
        </div>

        {/* User Info Skeleton */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <SkeletonUserInfo />
            <SkeletonButtons count={3} />
          </div>

          <SkeletonText lines={2} className="mb-4" />

          <SkeletonUserDetails count={3} />
        </div>
      </div>
    </GlassCard>

    {/* Stats Section Skeleton */}
    <SkeletonStatCards count={3} className="mb-8" />

    {/* About Section Skeleton */}
    <GlassCard className="mb-8">
      <div className="space-y-6">
        <div>
          <Skeleton 
            height="h-8" 
            width="w-24" 
            className="mb-4 bg-white/10 rounded-lg"
          />
          <SkeletonText lines={3} />
        </div>

        <div>
          <Skeleton 
            height="h-6" 
            width="w-20" 
            className="mb-3 bg-white/10 rounded"
          />
          <SkeletonSkills count={6} />
        </div>

        <div>
          <Skeleton 
            height="h-6" 
            width="w-24" 
            className="mb-3 bg-white/10 rounded"
          />
          <Skeleton 
            height="h-5" 
            width="w-48" 
            className="bg-white/10 rounded"
          />
        </div>
      </div>
    </GlassCard>

    {/* Posts Grid Skeleton */}
    <div className="mb-8">
      <Skeleton 
        height="h-8" 
        width="w-24" 
        className="mb-6 bg-white/10 rounded-lg"
      />
      <SkeletonPostGrid count={6} />
    </div>
  </>
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
      className="relative bg-black rounded-3xl overflow-hidden shadow-2xl"
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
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 flex items-center justify-between">
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
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 h-1">
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