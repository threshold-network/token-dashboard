import React, { FC } from "react"
import {
  Box,
  Badge,
  Image,
  LabelSm,
  LabelXs,
  LabelLg,
  BodyMd,
  BodySm,
  TextProps,
  Flex,
  BoxProps,
  LabelMd,
} from "@threshold-network/components"

type Sizes = "sm" | "md" | "lg"

export type TimelineProps = {
  stepText: string
  helperLabelText: string
  isActive: boolean
  isComplete: boolean
  title: string
  description: string | JSX.Element
  imageSrc: any
  size?: Sizes
  withBadge?: boolean
} & BoxProps

type TimelinePart = { component: React.ComponentType<TextProps> }

// TODO: It's a temporary solution, we should use a `Step` component based on
// the TDS and implement correct sizes, variants etc. in components repo.
const timelineSizeMap: Record<
  Sizes,
  { label: TimelinePart; title: TimelinePart; description: TimelinePart }
> = {
  sm: {
    label: {
      component: LabelXs,
    },
    title: {
      component: LabelSm,
    },
    description: {
      component: BodySm,
    },
  },
  md: {
    label: {
      component: LabelSm,
    },
    title: {
      component: LabelMd,
    },
    description: {
      component: BodyMd,
    },
  },
  lg: {
    label: {
      component: LabelSm,
    },
    title: {
      component: LabelLg,
    },
    description: {
      component: BodyMd,
    },
  },
}

const TimelineItem: FC<TimelineProps> = ({
  stepText,
  helperLabelText,
  isComplete,
  isActive,
  title,
  description,
  imageSrc,
  size = "sm",
  withBadge = true,
  ...restProps
}) => {
  const Label = timelineSizeMap[size].label.component
  const Title = timelineSizeMap[size].title.component
  const Description = timelineSizeMap[size].description.component

  return (
    <Box
      pl={4}
      w="full"
      borderLeftWidth="4px"
      borderLeftStyle="solid"
      borderColor={isActive || isComplete ? "brand.500" : "gray.300"}
      {...restProps}
    >
      <Flex alignItems="center" mb="2.5">
        <Label color="brand.500">{stepText}</Label>
        {isActive && withBadge && (
          <Badge size="sm" variant="subtle" ml="auto">
            {helperLabelText}
          </Badge>
        )}
      </Flex>
      <Title>{title}</Title>
      {isActive && <Description mt={4}>{description}</Description>}
      {isActive && <Image mt={4} src={imageSrc} mx="auto" />}
    </Box>
  )
}

export default TimelineItem
