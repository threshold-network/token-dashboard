import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Button,
  ButtonProps,
  forwardRef,
  Icon,
} from "@threshold-network/components"
import { FiArrowUpRight } from "react-icons/all"
import { LinkProps } from "../Link"

const ButtonLink: FC<ButtonProps & LinkProps> = forwardRef(
  ({ isExternal, href, to, icon, children, ...props }, ref) => {
    return (
      <Button
        as={isExternal ? "a" : RouterLink}
        ref={isExternal ? ref : undefined}
        href={isExternal ? href : undefined}
        to={isExternal ? undefined : to}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
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
