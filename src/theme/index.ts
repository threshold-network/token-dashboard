import { extendTheme, theme } from "@chakra-ui/react"
import { Button } from "./Button"
import { Badge } from "./Badge"
import { Alert } from "./Alert"
import { Divider } from "./Divider"
import { Card } from "./Card"
import { Progress } from "./Progress"
import { InfoBox } from "./InfoBox"
import { NotificationPill } from "./NotificationPill"
import { Tree } from "./Tree"
import { Tabs } from "./Tabs"

const colors = {
  brand: {
    50: "#FCF9FF",
    100: "#D5C6FF",
    // 200
    300: "#9974FF",
    // 400
    500: "#7D00FF", // main Threshold brand color
    550: "#7C47EE", // main Threshold brand color - DARK MODE
    600: "#BD30FF",
    700: "#4E2E99",
    800: "#3B257A",
    900: "#1C0758",
  },
  gray: {
    ...theme.colors.gray,
    50: "#F6F7FA",
    100: "#E2E8F0",
    // 200
    300: "#B1BCCC",
    // 400
    500: "#718096",
    // 600
    700: "#4A5568",
    800: "#323A47",
    900: "#1D2229",
  },
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
  green: {
    50: "#F0FFF4",
    100: "#C6F6D5",
    200: "#9AE6B4",
    300: "#68D391",
    400: "#48BB78",
    500: "#38A169",
    600: "#25855A",
    700: "#276749",
    800: "#22543D",
    900: "#1C4532",
  },
}

const index = extendTheme({
  colors,
  components: {
    Alert,
    Button,
    Badge,
    Card,
    Divider,
    Progress,
    InfoBox,
    NotificationPill,
    Tree,
    Tabs,
  },
})

export default index
