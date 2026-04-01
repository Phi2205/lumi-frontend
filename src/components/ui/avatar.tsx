"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import Link from "next/link"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}


interface StoryAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  hasStory?: boolean
  isSeen?: boolean
  isOnline?: boolean
  username?: string
  storyRingSize?: "sm" | "md" | "lg" | "xl"
}

const STORY_RING_SIZES = {
  sm: { outer: "-inset-[3px]", inner: "-inset-[1px]" },   // 2px border, 1px gap
  md: { outer: "-inset-[4.5px]", inner: "-inset-[1.5px]" }, // 3px border, 1.5px gap
  lg: { outer: "-inset-[6px]", inner: "-inset-[2px]" },   // 4px border, 2px gap
  xl: { outer: "-inset-[9px]", inner: "-inset-[3px]" }    // 6px border, 3px gap
}

function StoryAvatar({
  src,
  alt = "Avatar",
  hasStory = false,
  isSeen = false,
  isOnline = false,
  username,
  storyRingSize = "sm",
  className,
  ...props
}: StoryAvatarProps) {
  const rings = STORY_RING_SIZES[storyRingSize] || STORY_RING_SIZES.sm

  const content = (
    <div className={cn("relative shrink-0", className)} {...props}>
      {hasStory && (
        <>
          {/* Lớp gradient bọc ngoài cùng */}
          <div
            className={cn(
              "absolute rounded-full transition-all duration-300",
              rings.outer,
              isSeen
                ? "bg-white/50"
                : "bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600"
            )}
          />
          {/* Lớp nền đen để tạo khoảng trống giữa gradient và avatar */}
          <div className={cn("absolute rounded-full bg-background", rings.inner)} />
        </>
      )}

      {/* Main Avatar - Giữ nguyên kích thước gốc không bị đè bởi padding */}
      <Avatar className="size-full overflow-hidden border-none ring-0 relative z-0">
        <AvatarImage
          src={src}
          alt={alt}
          className="size-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
        />
        <AvatarFallback className="bg-white/10 text-white/50">{alt?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {isOnline && (
        <span className={cn(
          "absolute -bottom-[2px] -right-[2px] size-[30%] min-w-3 min-h-3 rounded-full bg-green-500 z-10",
          hasStory && "-bottom-[3px] -right-[3px]"
        )} />
      )}
    </div>
  )

  if (username) {
    const href = hasStory ? `/stories/${username}` : `/users/${username}`
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return content
}

export { Avatar, AvatarImage, AvatarFallback, StoryAvatar }

