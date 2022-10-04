import { FC, ReactElement } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Button,
  ButtonProps,
  forwardRef,
  Icon,
  useColorModeValue,
} from "@threshold-network/components"
import { FiArrowUpRight } from "react-icons/all"

interface CommonProps extends ButtonProps {
  icon?: ReactElement
}

type LinkHrefProps =
  | { isExternal?: false; href?: never }
  | { isExternal: true; href: string }

type LinkToProps =
  | { isExternal?: false; to: string }
  | { isExternal: true; to?: never }

type Props = CommonProps & LinkHrefProps & LinkToProps

const ButtonLink: FC<Props> = forwardRef(
  ({ isExternal, href, to, icon, children, ...props }, ref) => {
    return (
      <Button
        as={isExternal ? "a" : RouterLink}
        ref={isExternal ? ref : undefined}
        href={isExternal ? href : undefined}
        to={isExternal ? undefined : to}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        // textDecoration="underline"
        rightIcon={
          icon ? (
            icon
          ) : isExternal ? (
            <Icon boxSize="12px" ml="1" as={FiArrowUpRight} />
          ) : undefined
        }
        {...props}
      >
        {children}
      </Button>
    )
  }
)

export default ButtonLink
