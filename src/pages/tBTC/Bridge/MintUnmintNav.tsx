import { ComponentProps, FC } from "react"
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
  // TODO: set the proper selectedTabId based on the current location.
  return (
    <Box as="nav" {...props}>
      <FilterTabs selectedTabId={"0"}>
        {pages.filter((page) => !!page.route.title).map(renderNavItem)}
      </FilterTabs>
    </Box>
  )
}
