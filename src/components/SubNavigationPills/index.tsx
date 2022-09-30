import { FC } from "react"
import {
  Box,
  BodyMd,
  Divider,
  HStack,
  Link,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import { Link as RouterLink, useMatch, useResolvedPath } from "react-router-dom"
import { RouteProps } from "../../types"

interface Props {
  links: RouteProps[]
}

const SubNavigationPills: FC<Props> = ({ links }) => {
  const linksWithTitle = links.filter((link) => !!link.title)
  return (
    <>
      <Box
        w="100%"
        borderBottom="1px solid"
        borderColor="gray.100"
        py={6}
        pr={10}
        pl={{ base: 8, md: 16 }}
        as="nav"
      >
        <HStack
          spacing={4}
          divider={<Divider orientation="vertical" borderColor="gray.300" />}
          height="28px"
          as="ul"
        >
          {linksWithTitle.map(renderPill)}
        </HStack>
      </Box>
    </>
  )
}

const NavPill: FC<RouteProps> = ({ path, pathOverride, title }) => {
  const resolved = useResolvedPath(pathOverride || path)
  const isActive = useMatch({ path: resolved.pathname, end: true })
  const activeColor = useColorModeValue("brand.500", "white")
  const underlineColor = useColorModeValue("brand.500", "white")

  return (
    <Stack position="relative" padding={2} as="li">
      <BodyMd>
        <Link
          fontWeight={isActive ? "700" : undefined}
          color={isActive ? activeColor : undefined}
          as={RouterLink}
          to={path}
          _hover={{
            textDecoration: "none",
          }}
        >
          {title}
        </Link>
      </BodyMd>
      {isActive && (
        <Divider
          opacity="1"
          borderColor={underlineColor}
          border="1px solid"
          top="47px"
          position="absolute"
          left={0}
          borderRadius="8px"
        />
      )}
    </Stack>
  )
}

const renderPill = (pill: RouteProps) => <NavPill key={pill.path} {...pill} />

export default SubNavigationPills
