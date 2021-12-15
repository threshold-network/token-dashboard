import { FC } from "react"
import { Box, Divider, HStack, Link, Stack } from "@chakra-ui/react"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

interface Props {
  links: {
    text: string
    href: string
    isActive: boolean
  }[]
}

const SubNavigationPills: FC<Props> = ({ links }) => {
  const { url } = useRouteMatch()

  return (
    <Box w="100%" borderBottom="1px solid" borderColor="gray.100" padding={6}>
      <HStack
        spacing={4}
        divider={<Divider orientation="vertical" borderColor="gray.300" />}
        height="28px"
      >
        {links.map((link) => (
          <Stack key={link.href} position="relative" padding={2}>
            <Link
              fontWeight={link.isActive ? "700" : undefined}
              color={link.isActive ? "brand.500" : undefined}
              as={RouterLink}
              to={`${url}${link.href}`}
              _hover={{
                textDecoration: "none",
              }}
            >
              {link.text}
            </Link>
            {link.isActive && (
              <Divider
                borderColor="brand.500"
                border="2px solid"
                top="47px"
                position="absolute"
                left={0}
              />
            )}
          </Stack>
        ))}
      </HStack>
    </Box>
  )
}

export default SubNavigationPills
