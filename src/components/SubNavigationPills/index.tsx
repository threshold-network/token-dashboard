import { FC } from "react"
import {
  Box,
  Divider,
  HStack,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Link as RouterLink, useMatch, useResolvedPath } from "react-router-dom"
import { RouteProps } from "../../types"

interface Props {
  links: RouteProps[]
}

const SubNavigationPills: FC<Props> = ({ links }) => {
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
          {links.map(renderPill)}
        </HStack>
      </Box>
    </>
  )
}

const NavPill: FC<RouteProps> = ({ path, title }) => {
  const resolved = useResolvedPath(path)
  const isActive = useMatch({ path: resolved.pathname, end: true })
  const activeColor = useColorModeValue("brand.500", "white")

  return (
    <Stack position="relative" padding={2} as="li">
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
      {isActive && (
        <Divider
          borderColor="brand.500"
          border="2px solid"
          top="47px"
          position="absolute"
          left={0}
        />
      )}
    </Stack>
  )
}

const renderPill = (pill: RouteProps) => <NavPill key={pill.path} {...pill} />

export default SubNavigationPills
