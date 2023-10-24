import { FC } from "react"
import {
  Box,
  BodyMd,
  Divider,
  HStack,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import { matchPath, resolvePath, useLocation } from "react-router-dom"
import { RouteProps } from "../../types"
import Link from "../Link"

interface SubNavigationPillsProps {
  links: RouteProps[]
}

interface PathMatchResult {
  index: number
  path: string
  pathOverride?: string
  resolvedPath: string
  match: any
}
interface NavPill extends RouteProps {
  isActive?: boolean
}

const SubNavigationPills: FC<SubNavigationPillsProps> = ({ links }) => {
  const { pathname } = useLocation()
  const linksWithTitle = links.filter((link) => !!link.title)
  const activePillIndex = getActivePillIndex(linksWithTitle, pathname)
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
          {linksWithTitle.map((linkWithTitle, index) => {
            const isActive = index === activePillIndex
            return renderPill(linkWithTitle, isActive)
          })}
        </HStack>
      </Box>
    </>
  )
}

const NavPill: FC<NavPill> = ({ path, title, isActive = false }) => {
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

const renderPill = (pill: RouteProps, isActive = false) => (
  <NavPill key={pill.path} isActive={isActive} {...pill} />
)

const getPathMatches = (pills: RouteProps[], locationPathname: string) => {
  const pathMatches: PathMatchResult[] = []
  for (let i = 0; i < pills.length; i++) {
    const { path, pathOverride, parentPathBase } = pills[i]
    // This is a workaround for preview links. We have to remove the branch name
    // from the pathname so first we check if `parentPathBase` is not an
    // undefined. If it is then it means that this is the main page without any
    // additional paths so we can just use an empty string here. If it's not
    // undefined then we have to remove all the characters (if there are any)
    // that are before the occurrence of the `parentPathBase`. If this is a
    // preview then those removed characters should be a name of the branch. In
    // other cases there should not be any character before the occurrence of
    // the `parentPathBase` so nothing happens.
    const currentPathname = parentPathBase
      ? locationPathname.includes(parentPathBase) &&
        locationPathname.indexOf(parentPathBase) !== 0
        ? locationPathname.substring(
            locationPathname.indexOf(parentPathBase),
            locationPathname.length
          )
        : locationPathname
      : ""
    const resolved = resolvePath(
      pathOverride
        ? `${parentPathBase}/${pathOverride}`
        : `${parentPathBase}/${path}`
    )
    const match = matchPath(
      { path: resolved.pathname, end: true },
      currentPathname
    )
    pathMatches.push({
      index: i,
      path,
      pathOverride,
      resolvedPath: resolved.pathname,
      match,
    })
  }
  return pathMatches
}

const getActivePillIndex = (pills: RouteProps[], locationPathname: string) => {
  const pathMatches = getPathMatches(pills, locationPathname)
  const matchedPaths = pathMatches.filter((_) => {
    return !!_.match
  })
  if (matchedPaths.length === 0) return undefined
  if (matchedPaths.length === 1) return matchedPaths[0].index

  const matchedElementWithLongestPathnameBase = matchedPaths.reduce(
    (maxElement, currentElement) => {
      return currentElement.match.pathnameBase.length >
        maxElement.match.pathnameBase.length
        ? currentElement
        : maxElement
    }
  )

  return matchedElementWithLongestPathnameBase.index
}

export default SubNavigationPills
