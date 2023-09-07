import React, { ComponentProps, FC, useContext } from "react"
import {
  OrderedList,
  ListProps,
  LabelSm,
  LabelXs,
  BodySm,
  LabelMd,
  BodyMd,
  LabelLg,
  TextProps,
  ListItem,
  ListItemProps,
  Badge,
  ImageProps,
  Image,
  useColorModeValue,
} from "@threshold-network/components"

type Sizes = "sm" | "md" | "lg"

type StepsContext = {
  size: Sizes
}

const StepsContext = React.createContext<StepsContext | undefined>(undefined)

const useStepsContext = () => {
  const context = useContext(StepsContext)

  if (!context) {
    throw new Error("StepsContext used outside of the Steps component.")
  }

  return context
}

type StepsProps = { size?: Sizes } & Omit<ListProps, "size">

export const Steps: FC<StepsProps> = ({
  size = "sm",
  children,
  ...restProps
}) => {
  return (
    <StepsContext.Provider value={{ size: size ?? "sm" }}>
      <OrderedList {...restProps} listStyleType="none" ml="unset">
        {children}
      </OrderedList>
    </StepsContext.Provider>
  )
}

// TODO: It's a temporary solution, we should use a `Step` component based on
// the TDS and implement correct sizes, variants etc. in components repo.
type StepPart = { component: React.ComponentType<TextProps> }

const stepSizeMap: Record<
  Sizes,
  { label: StepPart; title: StepPart; description: StepPart }
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

type StepContext = {
  isActive: boolean
  isComplete: boolean
  size: Sizes
}

const StepContext = React.createContext<StepContext | undefined>(undefined)

const useStepContext = () => {
  const context = useContext(StepContext)

  if (!context) {
    throw new Error("StepContext used outside of the Step component.")
  }

  return context
}

export type StepProps = {
  isActive: boolean
  isComplete: boolean
} & Omit<ListItemProps, "title">

// TODO: move to the components repo and create component based on the TDS:
// https://www.figma.com/file/zZi2fYDUjWEMPQJWAt8VWv/Threshold-DS?type=design&node-id=817-13246&t=F0zDjiXrVDriJaH9-0
export const Step: FC<StepProps> = ({
  children,
  isActive,
  isComplete,
  ...restProps
}) => {
  const { size } = useStepsContext()
  const activeBorderColor = useColorModeValue("brand.500", "brand.300")

  return (
    <StepContext.Provider
      value={{
        isActive,
        isComplete,
        size,
      }}
    >
      <ListItem
        pl={4}
        w="full"
        borderLeftWidth="4px"
        borderLeftStyle="solid"
        borderColor={isActive || isComplete ? activeBorderColor : "gray.300"}
        {...restProps}
      >
        {children}
      </ListItem>
    </StepContext.Provider>
  )
}

export const StepIndicator: FC<ComponentProps<typeof LabelSm>> = ({
  children,
  ...restProps
}) => {
  const { size } = useStepContext()
  const textColor = useColorModeValue("brand.500", "brand.300")

  const Label = stepSizeMap[size].label.component

  return (
    <Label color={textColor} {...restProps}>
      {children}
    </Label>
  )
}

export const StepBadge: FC<ComponentProps<typeof Badge>> = ({
  children,
  ...restProps
}) => {
  return (
    <Badge size="sm" variant="subtle" mt="2" {...restProps}>
      {children}
    </Badge>
  )
}

export const StepTitle: FC<TextProps> = ({ children, ...restProps }) => {
  const { size } = useStepContext()

  const Title = stepSizeMap[size].title.component

  return (
    <Title {...restProps} mt="2">
      {children}
    </Title>
  )
}

export const StepDescription: FC<TextProps> = ({ children, ...restProps }) => {
  const { size, isActive } = useStepContext()

  const Description = stepSizeMap[size].description.component

  return isActive ? (
    <Description mt={3} {...restProps}>
      {children}
    </Description>
  ) : null
}

type StepImageProps = { imageSrc: any } & ImageProps

export const StepImage: FC<StepImageProps> = ({ imageSrc, ...restProps }) => {
  const { isActive } = useStepContext()

  return isActive ? (
    <Image mt={4} src={imageSrc} mx="auto" {...restProps} />
  ) : null
}
