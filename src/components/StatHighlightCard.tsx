import {
  BoxProps,
  Card,
  H1,
  HStack,
  IconProps,
  LabelSm,
  TextProps,
  VStack,
} from "@threshold-network/components"
import { FC } from "react"
import TooltipIcon from "./TooltipIcon"

export const StatHighlightCard: FC<BoxProps> = ({ children, ...restProps }) => {
  return (
    <Card h="100%" w="100%" {...restProps}>
      {children}
    </Card>
  )
}

export const StatHighlightTitle: FC<{ title: string } & TextProps> = ({
  title,
  children,
  ...restProps
}) => {
  return (
    <HStack>
      <LabelSm textTransform={"uppercase"} {...restProps}>
        {title}
      </LabelSm>
      {children}
    </HStack>
  )
}

export const StatHighlightTitleTooltip: FC<
  { label: string | JSX.Element } & IconProps
> = ({ label, ...restProps }) => {
  return (
    <TooltipIcon
      color="unset"
      label={label}
      width="20px"
      height="20px"
      alignSelf="center"
      m="auto"
      verticalAlign="text-top"
      {...restProps}
    />
  )
}

export const StatHighlightValue: FC<{ value: string & TextProps }> = ({
  value,
  ...restProps
}) => {
  return (
    <H1 mt="10" mb="9" textAlign="center" {...restProps}>
      {value}
    </H1>
  )
}

export const StatHighlightLink: FC<{ href: string & TextProps }> = ({
  href,
  ...restProps
}) => {
  return (
    <H1 mt="10" mb="9" textAlign="center" {...restProps}>
      {href}
    </H1>
  )
}
