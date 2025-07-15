import { ComponentProps, FC, useEffect, useState } from "react"
import {
  matchPath,
  resolvePath,
  useLocation,
  useResolvedPath,
} from "react-router"
import { Box, Card, FilterTabs, FilterTab } from "@threshold-network/components"
import Link from "../../../components/Link"
import { PageComponent } from "../../../types"
import { isL2Network } from "../../../networks/utils"
import { useIsActive } from "../../../hooks/useIsActive"
import { useNonEVMConnection } from "../../../hooks/useNonEVMConnection"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { Contract } from "ethers"

const renderNavItem = (
  page: PageComponent,
  index: number,
  isDisabled: boolean
) => (
  <FilterTab
    key={page.route.path}
    as={Link}
    to={page.route.path}
    tabId={index.toString()}
    textDecoration="none"
    _groupHover={{ textDecoration: "none" }}
    disabled={isDisabled}
  >
    {page.route.title}
  </FilterTab>
)

export const MintUnmintNav: FC<
  ComponentProps<typeof Card> & { pages: PageComponent[] }
> = ({ pages, ...props }) => {
  const threshold = useThreshold()
  const resolved = useResolvedPath("")
  const location = useLocation()
  const [isL2BitcoinRedeemerContract, setIsL2BitcoinRedeemerContract] =
    useState<Contract | null>(null)

  useEffect(() => {
    setIsL2BitcoinRedeemerContract(threshold.tbtc.l2BitcoinRedeemerContract)
  }, [threshold.tbtc.l2BitcoinRedeemerContract])

  const activeTabId = pages
    .map((page) =>
      resolvePath(page.route.pathOverride || page.route.path, resolved.pathname)
    )
    .map((resolvedPath) =>
      matchPath({ path: resolvedPath.pathname, end: true }, location.pathname)
    )
    .findIndex((match) => !!match)
    .toString()

  const shouldDisableUnmint =
    threshold.config.crossChain.isCrossChain && !isL2BitcoinRedeemerContract

  return (
    <Box as="nav" {...props}>
      <FilterTabs selectedTabId={activeTabId}>
        {pages
          .filter((page) => !!page.route.title)
          .map((page, index) => {
            const isUnmint =
              !!page.route.title && page.route.title.toLowerCase() !== "mint"
            return renderNavItem(page, index, shouldDisableUnmint && isUnmint)
          })}
      </FilterTabs>
    </Box>
  )
}
