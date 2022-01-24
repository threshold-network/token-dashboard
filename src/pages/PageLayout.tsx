import { FC } from "react"
import { Container } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import SubNavigationPills from "../components/SubNavigationPills"
import { PageComponent } from "../types"
import useDocumentTitle from "../hooks/useDocumentTitle"

const PageLayout: FC<{ pages?: PageComponent[]; title?: string }> = ({
  pages,
  title,
}) => {
  useDocumentTitle(`Threshold - ${title}`)
  const links = pages ? pages.map((_) => _.route) : []

  return (
    <>
      <SubNavigationPills links={links} />
      <Container maxW={{ base: "2xl", xl: "6xl" }} mt="6.25rem">
        <Outlet />
      </Container>
    </>
  )
}

export default PageLayout
