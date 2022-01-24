import { Children, FC } from "react"
import { Container } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import SubNavigationPills from "../components/SubNavigationPills"
import { PageComponent } from "../types"
import useDocumentTitle from "../hooks/useDocumentTitle"

const PageLayout: FC<{ pages?: PageComponent[]; title?: string }> = ({
  pages,
  title,
  children,
}) => {
  useDocumentTitle(`Threshold - ${title}`)
  const links = pages ? pages.map((_) => _.route) : []

  return (
    <>
      {links.length > 0 && <SubNavigationPills links={links} />}
      <Container maxW={{ base: "2xl", xl: "6xl" }} mt="6.25rem" my={16}>
        {children}
        <Outlet />
      </Container>
    </>
  )
}

export default PageLayout
