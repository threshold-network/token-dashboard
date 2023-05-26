import { FC } from "react"
import {
  Box,
  BodyMd,
  Divider,
  HStack,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import { useMatch, useResolvedPath } from "react-router-dom"
import { RouteProps } from "../../types"
import Link from "../Link"

interface SubNavigationPillsProps {
  links: RouteProps[]
}

interface NavPill extends RouteProps {
  isActive: boolean
}

const SubNavigationPills: FC<SubNavigationPillsProps> = ({ links }) => {
  const linksWithTitle = links.filter((link) => !!link.title)
  const navPills = addActiveStatusToPills(linksWithTitle)
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
          {navPills.map(renderPill)}
        </HStack>
      </Box>
    </>
  )
}

const NavPill: FC<NavPill> = ({ path, title, isActive }) => {
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

const renderPill = (pill: NavPill) => <NavPill key={pill.path} {...pill} />

/**
 * Adds `isActive` property to each of the link. If there are two or more links
 * that are active (based on `useMatch` hook) then we only keep the active
 * status for the last one.
 * @param {RouteProps[]} pills Array of links (RouteProps)
 * @return {RouteProps[]} Array of links with active status added to each of them. Only one
 * link can have an active status.
 */
const addActiveStatusToPills = (pills: RouteProps[]) => {
  const pillsWithActiveStatus: NavPill[] = []
  let indexOfLastActivePill
  for (let i = 0; i < pills.length; i++) {
    const { path, pathOverride } = pills[i]
    const resolved = useResolvedPath(pathOverride || path)
    const match = useMatch({ path: resolved.pathname, end: true })
    const isActive = !!match
    if (isActive) {
      // remove the active status of the previous pill
      if (indexOfLastActivePill !== undefined) {
        pillsWithActiveStatus[indexOfLastActivePill].isActive = false
      }
      indexOfLastActivePill = i
    }
    const pillWithActiveStatus = {
      ...pills[i],
      isActive,
    }
    pillsWithActiveStatus.push(pillWithActiveStatus)
  }
  return pillsWithActiveStatus
}

export default SubNavigationPills
