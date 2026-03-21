"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

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
}

function StoryAvatar({
  src,
  alt = "Avatar",
  hasStory = false,
  isSeen = false,
  isOnline = false,
  className,
  ...props
}: StoryAvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)} {...props}>
      {hasStory && (
        <>
          {/* Lớp gradient bọc ngoài cùng (từ -4px đến -2px) */}
          <div
            className={cn(
              "absolute -inset-[3px] rounded-full transition-all duration-300",
              isSeen
                ? "bg-neutral-600"
                : "bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600"
            )}
          />
          {/* Lớp nền đen để tạo khoảng trống giữa gradient và avatar (từ -1.5px đến 0px) */}
          <div className="absolute -inset-[1px] rounded-full bg-background" />
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
}

export { Avatar, AvatarImage, AvatarFallback, StoryAvatar }

