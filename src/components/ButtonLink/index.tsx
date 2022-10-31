import { FC } from "react"
import { Button, ButtonProps, forwardRef } from "@threshold-network/components"
import Link, { LinkProps } from "../Link"

const style = {
  textDecoration: "none",
}

const ButtonLink: FC<ButtonProps & LinkProps> = forwardRef(
  ({ ...props }, ref) => {
    return (
      <Button
        as={Link}
        ref={ref}
        textDecoration="none"
        _hover={style}
        {...props}
      />
    )
  }
)

export default ButtonLink
