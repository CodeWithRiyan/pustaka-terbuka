"use client"

import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"
import Image, { ImageProps } from "next/image"
import { useState } from "react"

export interface SmartImageProps extends Omit<ImageProps, "src"> {
  src?: string | null
  containerClassName?: string
  showSkeleton?: boolean
}

export default function SmartImage(props: SmartImageProps) {
  const {
    width,
    height,
    containerClassName,
    className,
    sizes,
    quality,
    src,
    alt,
    showSkeleton = true,
    ...prop
  } = props

  const [imageError, setImageError] = useState<boolean>(false)
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageError(false)
    setImageLoading(false)
  }

  return (
    <div
      className={cn(
        "relative flex aspect-[2/3] w-40 flex-none items-center justify-center overflow-hidden rounded-sm bg-gray-200",
        width && `w-[${width}px]`,
        height && `h-[${height}px]`,
        containerClassName
      )}
    >
      {imageLoading && showSkeleton && (
        <div className="absolute inset-0 animate-pulse bg-gray-300" />
      )}

      {src && !imageError ? (
        <Image
          {...prop}
          src={src}
          alt={alt || ""}
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            imageLoading ? "opacity-0" : "opacity-100",
            className
          )}
          sizes={sizes || "50vw"}
          quality={quality || 75}
          onError={(e) => {
            handleImageError()
            prop.onError?.(e)
          }}
          onLoad={(e) => {
            handleImageLoad()
            prop.onLoad?.(e)
          }}
        />
      ) : (
        <ImageIcon />
      )}
    </div>
  )
}
