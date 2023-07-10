import { FC } from "react"
import {
  Box,
  BodyMd,
  Divider,
  HStack,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import {
  matchPath,
  resolvePath,
  useLocation,
  useMatch,
  useResolvedPath,
} from "react-router-dom"
import { RouteProps } from "../../types"
import Link from "../Link"

interface SubNavigationPillsProps {
  links: RouteProps[]
}

interface NavPill extends RouteProps {
  resolvedPaths: string[]
}

const SubNavigationPills: FC<SubNavigationPillsProps> = ({ links }) => {
  const linksWithTitle = links.filter((link) => !!link.title)
  const resolvedPaths = getResolvedPathsFromPills(linksWithTitle)
  const wrapperBorderColor = useColorModeValue("gray.100", "gray.700")

  return (
    <>
      <Box
        w="100%"
        borderBottom="1px solid"
        borderColor={wrapperBorderColor}
        py={6}
        pr={10}
        pl={{ base: 8, md: 16 }}
        as="nav"
      >
        <HStack
          spacing={4}
          divider={
            <Divider orientation="vertical" borderColor={wrapperBorderColor} />
          }
          height="28px"
          as="ul"
        >
          {linksWithTitle.map((linkWithTitle) =>
            renderPill(linkWithTitle, resolvedPaths)
          )}
        </HStack>
      </Box>
    </>
  )
}

const NavPill: FC<NavPill> = ({ path, pathOverride, title, resolvedPaths }) => {
  let isActive = false
  const resolved = useResolvedPath(pathOverride || path)
  const { pathname } = useLocation()
  const match = matchPath(resolved.pathname, pathname)
  if (match) {
    if (match.params["*"]) {
      const lastPieceOfPath = match.pathname.replace(match.pathnameBase, "")
      if (!resolvedPaths.includes(lastPieceOfPath)) isActive = true
    } else {
      isActive = true
    }
  }
  const activeColor = useColorModeValue("brand.500", "gray.100")
  const underlineColor = useColorModeValue("brand.500", "white")

  return (
    <Stack position="relative" padding={2} as="li">
      <BodyMd>
        <Link
          fontWeight={isActive ? "700" : undefined}
          color={isActive ? activeColor : undefined}
          to={path}
          _hover={{
            textDecoration: "none",
          }}
          textDecoration="none"
        >
          {title}
        </Link>
      </BodyMd>
      {isActive && (
        <Divider
          opacity="1"
          borderColor={underlineColor}
          border="1px solid"
          top="49px"
          position="absolute"
          left={0}
          borderRadius="8px"
        />
      )}
    </Stack>
  )
}

const renderPill = (pill: RouteProps, resolvedPaths: string[]) => (
  <NavPill key={pill.path} resolvedPaths={resolvedPaths} {...pill} />
)

const getResolvedPathsFromPills = (pills: RouteProps[]) => {
  const resolvedPaths: string[] = []
  for (let i = 0; i < pills.length; i++) {
    const { path, pathOverride } = pills[i]
    const resolved = resolvePath(pathOverride || path)
    resolvedPaths.push(resolved.pathname)
  }
  return resolvedPaths
}

export default SubNavigationPills
