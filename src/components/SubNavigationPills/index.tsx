import { FC, createContext, useContext } from "react"
import {
  Box,
  Divider,
  HStack,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

interface NavPillProps {
  path: string
  text: string
}

interface Props {
  links: NavPillProps[]
  parentPath: string
}

const SubNavigationPillContext = createContext({ parentPath: "" })

const useSubNavigationPillContext = () => {
  return useContext(SubNavigationPillContext)
}

const SubNavigationPills: FC<Props> = ({ parentPath, links }) => {
  return (
    <SubNavigationPillContext.Provider value={{ parentPath }}>
      <Box
        w="100%"
        borderBottom="1px solid"
        borderColor="gray.100"
        padding={6}
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
    </SubNavigationPillContext.Provider>
  )
}

const NavPill: FC<NavPillProps> = ({ path, text }) => {
  const { parentPath } = useSubNavigationPillContext()
  const _path = `${parentPath}${path}`
  const isActive = useRouteMatch({ path: _path, exact: true })

  return (
    <Stack position="relative" padding={2} as="li">
      <Link
        fontWeight={isActive ? "700" : undefined}
        color={isActive ? useColorModeValue("brand.500", "white") : undefined}
        as={RouterLink}
        to={_path}
        _hover={{
          textDecoration: "none",
        }}
      >
        {text}
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

const renderPill = (pill: NavPillProps) => <NavPill key={pill.path} {...pill} />

export default SubNavigationPills
