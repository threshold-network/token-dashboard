import { ComponentProps, FC } from "react"
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
import { isValidL2Transaction } from "../../../networks/utils/validateL2TransactionType"
import { useIsActive } from "../../../hooks/useIsActive"

const renderNavItem = (
  page: PageComponent,
  index: number,
  chainId?: number | string
) => (
  <FilterTab
    key={page.route.path}
    as={Link}
    to={page.route.path}
    tabId={index.toString()}
    textDecoration="none"
    _groupHover={{ textDecoration: "none" }}
  >
    {page.route.title}
  </FilterTab>
)

export const MintUnmintNav: FC<
  ComponentProps<typeof Card> & { pages: PageComponent[] }
> = ({ pages, ...props }) => {
  const { chainId } = useIsActive()
  const resolved = useResolvedPath("")
  const location = useLocation()

  const activeTabId = pages
    .map((page) =>
      resolvePath(page.route.pathOverride || page.route.path, resolved.pathname)
    )
    .map((resolvedPath) =>
      matchPath({ path: resolvedPath.pathname, end: true }, location.pathname)
    )
    .findIndex((match) => !!match)
    .toString()

  return (
    <Box as="nav" {...props}>
      <FilterTabs selectedTabId={activeTabId}>
        {isL2Network(chainId)
          ? pages
              .filter(
                (page) =>
                  !!page.route.title &&
                  isValidL2Transaction(page.route.title?.toUpperCase())
              )
              .map((filteredPage, index) =>
                renderNavItem(filteredPage, index, chainId)
              )
          : pages
              .filter((page) => !!page.route.title)
              .map((filteredPage, index) => renderNavItem(filteredPage, index))}
      </FilterTabs>
    </Box>
  )
}
