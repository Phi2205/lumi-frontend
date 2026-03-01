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
    <div
      className={cn(
        "relative flex shrink-0 rounded-full transition-all duration-300",
        hasStory && "p-[3px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600",
        hasStory && isSeen && "bg-neutral-600 bg-none",
        className
      )}
      {...props}
    >
      <div className={cn("size-full rounded-full bg-background p-[2px]", !hasStory && "p-0")}>
        <Avatar className="size-full overflow-hidden">
          <AvatarImage
            src={src}
            alt={alt}
            className="size-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
          />
          <AvatarFallback>{alt?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      {isOnline && (
        <span className={cn(
          "absolute bottom-0 right-0 size-[28%] min-w-3 min-h-3 rounded-full border-2 border-background bg-green-500 z-10",
          hasStory && "bottom-[5%] right-[5%]"
        )} />
      )}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback, StoryAvatar }

