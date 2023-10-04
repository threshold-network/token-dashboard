import { FC } from "react"
import { Container, ContainerProps } from "@threshold-network/components"
import { Outlet } from "react-router-dom"
import SubNavigationPills from "../components/SubNavigationPills"
import { PageComponent } from "../types"
import useDocumentTitle from "../hooks/useDocumentTitle"

export interface PageLayoutProps extends ContainerProps {
  pages?: PageComponent[]
  title?: string
}

const PageLayout: FC<PageLayoutProps> = ({
  pages,
  title,
  children,
  ...restProps
}) => {
  useDocumentTitle(`Threshold - ${title}`)
  const links = pages
    ? pages.filter((_) => !_.route.hideFromMenu).map((_) => _.route)
    : []

  return (
    <>
      {links.length > 0 && <SubNavigationPills links={links} />}
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
