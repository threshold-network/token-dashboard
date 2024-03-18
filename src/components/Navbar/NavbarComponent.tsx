import { FC } from "react"
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Stack,
  useColorModeValue,
  H5,
} from "@threshold-network/components"
import { Routes, Route, Link, useMatch } from "react-router-dom"
import WalletConnectionAlert from "./WalletConnectionAlert"
import HamburgerButton from "./HamburgerButton"
import DarkModeSwitcher from "./DarkModeSwitcher"
import AccountButton from "./AccountButton"
import NetworkButton from "./NetworkButton"
import ThresholdPurple from "../../static/icons/ThresholdPurple"
import ThresholdWhite from "../../static/icons/ThresholdWhite"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import { pages } from "../../pages"
import { PageComponent } from "../../types"

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
  const isOverviewPage = useMatch("overview/*")
  const borderBottomColor = useColorModeValue("gray.100", "gray.700")

  return (
    <>
      <Box
        p={6}
        pr={{ base: 6, md: 24 }}
        borderBottom={isOverviewPage ? undefined : "1px"}
        borderColor={borderBottomColor}
        display="flex"
      >
        <Routes>{pages.map(renderPageTitle)}</Routes>
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
      <Routes>{pages.map(renderMobileHeader)}</Routes>
    </>
  )
}

const renderPageTitle = (PageComponent: PageComponent) => {
  return (
    <Route
      key={PageComponent.route.path}
      path={`${PageComponent.route.path}/*`}
      element={
        PageComponent.route.title ? (
          <PageTitle title={PageComponent.route.title} />
        ) : (
          <></>
        )
      }
    />
  )
}

const PageTitle: FC<{ title: string }> = ({ title }) => {
  return (
    <H5 ml={12} display={{ base: "none", md: "block" }}>
      {title}
    </H5>
  )
}

const renderMobileHeader = (PageComponent: PageComponent) => {
  return (
    <Route
      key={PageComponent.route.path}
      path={`${PageComponent.route.path}/*`}
      element={
        PageComponent.route.title ? (
          <MobileHeader title={PageComponent.route.title} />
        ) : (
          <></>
        )
      }
    />
  )
}

const MobileHeader: FC<{ title: string }> = ({ title }) => {
  return (
    <Box
      display={{ base: "flex", md: "none" }}
      as="header"
      pl={10}
      py={6}
      borderBottom="1px"
      borderColor="gray.100"
    >
      <H5>{title}</H5>
    </Box>
  )
}

export default NavbarComponent
