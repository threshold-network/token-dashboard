import { FC } from "react"
import { Container, ContainerProps } from "@threshold-network/components"
import { Outlet } from "react-router-dom"
import SubNavigationPills from "../components/SubNavigationPills"
import { PageComponent, ExternalLinkProps } from "../types"
import useDocumentTitle from "../hooks/useDocumentTitle"
import { ExternalHref } from "../enums/externalHref"
import { Box, Link as ChakraLink } from "@chakra-ui/react"

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

  return (
    <>
      {links.length > 0 && (
        <SubNavigationPills links={links} externalLinks={externalLinks} />
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
      <Box
        as="footer"
        w="100%"
        py={2}
        textAlign="center"
        bg="rgba(255,255,255,0.9)"
      >
        <ChakraLink
          href={ExternalHref.privacyPolicy}
          isExternal
          color="gray.400"
          fontSize="xs"
          textDecoration="underline"
          mr={2}
        >
          Privacy Policy
        </ChakraLink>
        <ChakraLink
          href={ExternalHref.termsOfUse}
          isExternal
          color="gray.400"
          fontSize="xs"
          textDecoration="underline"
        >
          Terms of Use
        </ChakraLink>
      </Box>
    </>
  )
}

export default PageLayout
