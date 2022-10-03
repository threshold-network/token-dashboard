import { FC, ReactElement } from "react"
import {
  Icon,
  Link,
  LinkProps,
  useColorModeValue,
  forwardRef,
} from "@threshold-network/components"
import { FiArrowUpRight } from "react-icons/all"

interface Props {
  href: string
  text: string
  icon?: ReactElement
  isExternal?: boolean
}

const ExternalLink: FC<Props & LinkProps> = forwardRef(
  ({ text, href, icon, ...props }, ref) => {
    const defaultColor = useColorModeValue("brand.500", "white")
    const finalColor = props.color ? props.color : defaultColor

    return (
      <Link
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        color={finalColor}
        textDecoration="underline"
        {...props}
      >
        {text}
        {icon || <Icon boxSize="12px" ml="1" as={FiArrowUpRight} />}
      </Link>
    )
  }
)

export * from "./SharedLinks"

export default ExternalLink
