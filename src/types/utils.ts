import { ReactElement } from "react"
import { createIcon } from "@chakra-ui/icons"

export interface IconMap {
  [key: string]: ReactElement
}

export interface ChakraIconMap {
  [key: string]: ReturnType<typeof createIcon>
}
