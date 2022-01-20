import { FC } from "react"
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Routes, Route, Link, useMatch } from "react-router-dom"
import WalletConnectionAlert from "./WalletConnectionAlert"
import HamburgerButton from "./HamburgerButton"
import DarkModeSwitcher from "./DarkModeSwitcher"
import AccountButton from "./AccountButton"
import NetworkButton from "./NetworkButton"
import ThresholdPurple from "../../static/icons/ThresholdPurple"
import ThresholdWhite from "../../static/icons/ThresholdWhite"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import { H5 } from "../Typography"

interface NavbarComponentProps {
  account?: string | null
  chainId?: number
  openWalletModal: () => void
  deactivate: () => void
}

const NavbarComponent: FC<NavbarComponentProps> = ({
  account,
  chainId,
  openWalletModal,
  deactivate,
}) => {
  const isMobile = useChakraBreakpoint("md")
  const IconComponent = useColorModeValue(ThresholdPurple, ThresholdWhite)
  //TODO: Get title based on the current path.
  const title = "Upgrade"
  const isOverviewPage = useMatch("overview/*")

  return (
    <>
      <Box
        p={6}
        pr="5.25rem"
        borderBottom={isOverviewPage ? undefined : "1px"}
        borderColor="gray.100"
        display="flex"
      >
        <Routes>
          <Route path="overview/*" element={<></>} />
          <Route path="*" element={<PageTitle title={title} />} />
        </Routes>
        <Flex>
          <HamburgerButton display={{ base: "block", md: "none" }} />
          {isMobile && (
            <Link to="/">
              <IconButton
                variant="ghost"
                aria-label="home"
                icon={<Icon mt="5px" boxSize="22px" as={IconComponent} />}
              />
            </Link>
          )}
        </Flex>
        <Stack spacing={4} direction="row" ml="auto">
          <DarkModeSwitcher />
          {chainId && <NetworkButton chainId={chainId} />}
          <AccountButton {...{ openWalletModal, deactivate, account }} />
        </Stack>
        <WalletConnectionAlert {...{ account, chainId }} />
      </Box>
      <Routes>
        <Route path="overview/*" element={<></>} />
        <Route path="*" element={<MobileHeader title={title} />} />
      </Routes>
    </>
  )
}

const PageTitle: FC<{ title: string }> = ({ title }) => {
  const isMobile = useChakraBreakpoint("md")
  return !isMobile ? <H5 ml={"2.75rem"}>{title}</H5> : <></>
}

const MobileHeader: FC<{ title: string }> = ({ title }) => {
  const isMobile = useChakraBreakpoint("md")

  return isMobile ? (
    <Box
      as="header"
      pl={10}
      py={6}
      borderBottom="1px"
      borderColor="gray.100"
      display="flex"
    >
      <H5>{title}</H5>
    </Box>
  ) : (
    <></>
  )
}

export default NavbarComponent
