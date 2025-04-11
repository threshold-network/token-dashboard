import { Icon, useColorModeValue } from "@chakra-ui/react"
import { FC } from "react"

export const SUIIcon: FC = (props) => (
  <Icon
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="12"
      fill={useColorModeValue("#6FBCF0", "#6FBCF0")}
    />
    <path
      d="M7.272 7.993h5.478c0.38 0 0.687 0.307 0.687 0.687v1.29c0 0.38-0.307 0.687-0.687 0.687H7.272c-0.38 0-0.687-0.307-0.687-0.687v-1.29c0-0.38 0.307-0.687 0.687-0.687z"
      fill="white"
    />
    <path
      d="M7.272 13.343h9.456c0.38 0 0.687 0.307 0.687 0.687v1.29c0 0.38-0.307 0.687-0.687 0.687H7.272c-0.38 0-0.687-0.307-0.687-0.687v-1.29c0-0.38 0.307-0.687 0.687-0.687z"
      fill="white"
    />
  </Icon>
)
