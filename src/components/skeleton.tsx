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
