import { FC } from "react"
import {
  Box,
  Divider,
  HStack,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import {
  Link as RouterLink,
  useLocation,
  useRouteMatch,
} from "react-router-dom"

interface Props {
  links: {
    text: string
    href: string
  }[]
}

const SubNavigationPills: FC<Props> = ({ links }) => {
  const { url } = useRouteMatch()
  const { pathname } = useLocation()

  return (
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
        {links.map((link) => {
          const subroute = pathname.slice(url.length)
          const isActive = link.href === subroute

          return (
            <Stack key={link.href} position="relative" padding={2} as="li">
              <Link
                fontWeight={isActive ? "700" : undefined}
                color={
                  isActive ? useColorModeValue("brand.500", "white") : undefined
                }
                as={RouterLink}
                to={`${url}${link.href}`}
                _hover={{
                  textDecoration: "none",
                }}
              >
                {link.text}
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
        })}
      </HStack>
    </Box>
  )
}

export default SubNavigationPills
