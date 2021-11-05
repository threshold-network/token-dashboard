import { FC } from "react"
import { Heading, HeadingProps, Text, TextProps } from "@chakra-ui/react"

export const Headline: FC<HeadingProps> = (props) => {
  return <Heading fontSize="7xl" {...props} />
}

export const H1: FC<TextProps> = (props) => {
  return <Text as="h1" fontSize="6xl" {...props} />
}

export const H2: FC<TextProps> = (props) => {
  return <Text as="h2" fontSize="5xl" {...props} />
}

export const H3: FC<TextProps> = (props) => {
  return <Text as="h3" fontSize="4xl" {...props} />
}

export const H4: FC<TextProps> = (props) => {
  return <Text as="h4" fontSize="3xl" {...props} />
}

export const H5: FC<TextProps> = (props) => {
  return <Text as="h5" fontSize="2xl" {...props} />
}

export const Body1: FC<TextProps> = (props) => {
  return <Text as="p" fontSize="lg" {...props} />
}

export const Body2: FC<TextProps> = (props) => {
  return <Text as="p" fontSize="md" {...props} />
}

export const Body3: FC<TextProps> = (props) => {
  return <Text as="p" fontSize="sm" {...props} />
}
