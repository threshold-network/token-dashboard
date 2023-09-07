import { FC } from "react"
import {
  ListItem,
  ListItemProps,
  useColorModeValue,
} from "@threshold-network/components"

export const OutlineListItem: FC<ListItemProps> = ({ ...props }) => {
  const borderColor = useColorModeValue("gray.100", "gray.700")

  return (
    <ListItem
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderColor={borderColor}
      borderWidth="1px"
      borderStyle="solid"
      borderRadius="6px"
      py="4"
      px="6"
      {...props}
    />
  )
}
