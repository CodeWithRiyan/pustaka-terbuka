export function CardPortraitSkeleton() {
  return (
    <div className="bg-secondary/20 space-y-2 rounded-sm p-2">
      <div className="aspect-[2/3] w-40 animate-pulse rounded-md bg-gray-100" />
      <div className="h-6 w-40 animate-pulse rounded-md bg-gray-100" />
      <div className="h-8 w-40 animate-pulse rounded-md bg-gray-100" />
      <div className="h-8 w-40 animate-pulse rounded-md bg-gray-100" />
    </div>
  )
}

export default CardPortraitSkeleton
