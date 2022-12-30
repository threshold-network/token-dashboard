import { FC } from "react"
import {
  Box,
  List,
  ListItem,
  LabelMd,
  BodyMd,
  ListIcon,
  LabelSm,
  BodySm,
} from "@threshold-network/components"
import { BsFillArrowRightCircleFill } from "react-icons/all"

const ListItemWithIcon: FC = ({ children }) => {
  return (
    <ListItem display={"flex"} justifyItems="center">
      <ListIcon
        color="brand.500"
        my="auto"
        as={BsFillArrowRightCircleFill}
        w="16px"
        h="16px"
      />
      {children}
    </ListItem>
  )
}

export const TakeNoteList: FC<{ size?: "sm" | "md" }> = ({ size = "md" }) => {
  const LabelComponent = size === "sm" ? LabelSm : LabelMd
  const BodyComponent = size === "sm" ? BodySm : BodyMd
  return (
    <List spacing="4">
      <ListItem>
        <LabelComponent>minting duration</LabelComponent>
        <List spacing="2">
          <ListItemWithIcon>
            <BodyComponent as="span">
              Mint tBTC in around{" "}
              <Box as="span" color="brand.500">
                ~1 to 3 hours
              </Box>
              .
            </BodyComponent>
          </ListItemWithIcon>
        </List>
      </ListItem>
      <ListItem>
        <LabelComponent>funds time lock</LabelComponent>
        <List spacing="2">
          <ListItemWithIcon>
            <BodyComponent>
              Your BTC funds will be locked for{" "}
              <Box as="span" color="brand.500">
                6 months
              </Box>
              .
            </BodyComponent>
          </ListItemWithIcon>
        </List>
      </ListItem>
      <ListItem>
        <LabelComponent>unminting tbtc</LabelComponent>
        <List spacing="2">
          <ListItemWithIcon>
            <BodyComponent>
              Unminting is currently under construction.
            </BodyComponent>
          </ListItemWithIcon>
        </List>
      </ListItem>
    </List>
  )
}
