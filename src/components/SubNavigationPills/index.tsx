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

interface Props {
  links: RouteProps[]
}

const SubNavigationPills: FC<Props> = ({ links }) => {
  const linksWithTitle = links.filter((link) => !!link.title)
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
          {linksWithTitle.map(renderPill)}
        </HStack>
      </Box>
    </>
  )
}

const NavPill: FC<RouteProps> = ({ path, pathOverride, title }) => {
  const resolved = useResolvedPath(pathOverride || path)
  const isActive = useMatch({ path: resolved.pathname, end: true })
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

const renderPill = (pill: RouteProps) => <NavPill key={pill.path} {...pill} />

export default SubNavigationPills
