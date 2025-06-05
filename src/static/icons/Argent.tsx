import { useColorModeValue } from "@chakra-ui/react"
import { FC } from "react"

export const ArgentIcon: FC<{ width?: string; height?: string }> = ({
  width = "24",
  height = "24",
}) => {
  const fillColor = useColorModeValue("#FF875B", "#FF875B")

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L3 7V12C3 17.5 6.84 22.74 12 24C17.16 22.74 21 17.5 21 12V7L12 2Z"
        fill={fillColor}
      />
      <path
        d="M12 5.5L7.5 8V11.5C7.5 14.54 9.37 17.37 12 18C14.63 17.37 16.5 14.54 16.5 11.5V8L12 5.5Z"
        fill="white"
      />
      <path
        d="M12 8L10 9.5V11C10 12.38 10.84 13.62 12 14C13.16 13.62 14 12.38 14 11V9.5L12 8Z"
        fill={fillColor}
      />
    </svg>
  )
}
