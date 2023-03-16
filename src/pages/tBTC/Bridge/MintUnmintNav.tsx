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

const renderNavItem = (page: PageComponent, index: number) => (
  <FilterTab
    key={page.route.path}
    as={Link}
    to={page.route.path}
    tabId={index.toString()}
  >
    {page.route.title}
  </FilterTab>
)

export const MintUnmintNav: FC<
  ComponentProps<typeof Card> & { pages: PageComponent[] }
> = ({ pages, ...props }) => {
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
        {pages.filter((page) => !!page.route.title).map(renderNavItem)}
      </FilterTabs>
    </Box>
  )
}
