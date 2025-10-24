import { FC } from "react"
import {
  SkeletonText,
  Skeleton,
  SkeletonCircle,
} from "@threshold-network/components"

export const BridgeProcessDetailsPageSkeleton: FC = () => {
  return (
    <>
      <SkeletonText noOfLines={1} skeletonHeight={6} />

      <Skeleton height="80px" mt="4" />

      <SkeletonText noOfLines={1} width="40%" skeletonHeight={6} mt="8" />
      <SkeletonCircle mt="4" size="160px" mx="auto" />
      <SkeletonText mt="4" noOfLines={4} spacing={2} skeletonHeight={4} />
    </>
  )
}
