import { FC } from "react"
import {
  Heading,
  HeadingProps,
  Text,
  TextProps,
  useColorModeValue,
} from "@chakra-ui/react"

export const Headline: FC<HeadingProps> = (props) => {
  return (
    <Heading
      fontSize="7xl"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const H1: FC<TextProps> = (props) => {
  return (
    <Text
      as="h1"
      fontSize="60px"
      lineHeight="64px"
      fontWeight="bold"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const H2: FC<TextProps> = (props) => {
  return (
    <Text
      as="h2"
      fontSize="48px"
      lineHeight="48px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const H3: FC<TextProps> = (props) => {
  return (
    <Text
      as="h3"
      fontSize="36px"
      lineHeight="40px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const H4: FC<TextProps> = (props) => {
  return (
    <Text
      as="h4"
      fontSize="30px"
      lineHeight="38px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const H5: FC<TextProps> = (props) => {
  return (
    <Text
      as="h5"
      fontSize="24px"
      lineHeight="32px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const Body1: FC<TextProps> = (props) => {
  return (
    <Text
      as="p"
      fontSize="18px"
      lineHeight="28px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const Body2: FC<TextProps> = (props) => {
  return (
    <Text
      as="p"
      fontSize="16px"
      lineHeight="24px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const Body3: FC<TextProps> = (props) => {
  return (
    <Text
      as="p"
      fontSize="14px"
      lineHeight="20px"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const Label1: FC<TextProps> = (props) => {
  return (
    <Text
      fontWeight={600}
      fontSize="20px"
      lineHeight="28px"
      letterSpacing="0.1em"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const Label2: FC<TextProps> = (props) => {
  return (
    <Text
      fontWeight={600}
      fontSize="16px"
      lineHeight="24px"
      letterSpacing="0.075em"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}

export const Label3: FC<TextProps> = (props) => {
  return (
    <Text
      fontWeight={600}
      fontSize="14px"
      lineHeight="20px"
      letterSpacing="0.05em"
      color={useColorModeValue("gray.700", "gray.300")}
      {...props}
    />
  )
}
