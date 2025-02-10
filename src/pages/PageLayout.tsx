import { FC } from "react"
import { Container, ContainerProps } from "@threshold-network/components"
import { Outlet } from "react-router-dom"
import SubNavigationPills from "../components/SubNavigationPills"
import { PageComponent, ExternalLinkProps } from "../types"
import useDocumentTitle from "../hooks/useDocumentTitle"

export interface PageLayoutProps extends ContainerProps {
  pages?: PageComponent[]
  title?: string
  externalLinks?: ExternalLinkProps[]
}

const PageLayout: FC<PageLayoutProps> = ({
  pages,
  title,
  externalLinks,
  children,
  ...restProps
}) => {
  useDocumentTitle(`Threshold - ${title}`)
  const links = pages
    ? pages.filter((_) => !_.route.hideFromMenu).map((_) => _.route)
    : []

  const visibleExternalLinks = externalLinks
    ? externalLinks?.filter((_) => !_.hideFromMenu)
    : []

  return (
    <>
      {links.length > 0 && (
        <SubNavigationPills
          links={links}
          externalLinks={visibleExternalLinks}
        />
      )}
      <Container
        maxW={{ base: "2xl", xl: "6xl" }}
        mt="6.25rem"
        my={16}
        {...restProps}
      >
        {children}
        <Outlet />
      </Container>
    </>
  )
}

export default PageLayout
