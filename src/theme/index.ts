import { extendTheme } from "@chakra-ui/react"
import { Button } from "./Button"
import { Badge } from "./Badge"
import { Alert } from "./Alert"

const colors = {
  yellow: {
    50: "#FFFBE6",
    100: "#FFF1B8",
    200: "#FFE58F",
    300: "#FFD666",
    400: "#FFC53D",
    500: "#FAAD14",
    600: "#D48806",
    700: "#AD6800",
    800: "#874D00",
    900: "#613400",
  },
  red: {
    400: "#F55B4B",
    500: "#E53939",
    600: "#BF3030",
    700: "#992626",
    800: "#731D1D",
    900: "#4C1316",
  },
}

const index = extendTheme({
  colors,
  components: {
    Alert,
    Button,
    Badge,
  },
})

export default index
