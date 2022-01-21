import { FC } from "react"
import { Icon, Link, LinkProps, useColorModeValue } from "@chakra-ui/react"
import { FiArrowUpRight } from "react-icons/all"

interface Props {
  href: string
  text: string
  withArrow?: boolean
}

const ExternalLink: FC<Props & LinkProps> = ({
  text,
  href,
  withArrow,
  ...props
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      color={useColorModeValue("brand.500", "brand.300")}
      textDecoration="underline"
      {...props}
    >
      {text}{" "}
      {withArrow && (
        <Icon
          boxSize="12px"
          as={FiArrowUpRight}
          color={useColorModeValue("brand.500", "brand.300")}
        />
      )}
    </Link>
  )
}

export default ExternalLink
