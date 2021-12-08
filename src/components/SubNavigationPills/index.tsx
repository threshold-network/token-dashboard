import { FC } from "react"
import { Box, HStack, Link } from "@chakra-ui/react"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"
import Card from "../Card"

interface Props {
  links: {
    text: string
    href: string
    isActive: boolean
  }[]
}

const SubNavigationPills: FC<Props> = ({ links }) => {
  const { url } = useRouteMatch()

  console.log("url", url)

  return (
    <Card w="fit-content" padding={2}>
      <HStack>
        {links.map((link) => (
          <Link as={RouterLink} key={link.href} to={`${url}${link.href}`}>
            <Box
              bg={link.isActive ? "gray.700" : undefined}
              color={link.isActive ? "white" : undefined}
              paddingX={6}
              paddingY="6px"
              borderRadius="md"
              cursor="pointer"
            >
              {link.text}
            </Box>
          </Link>
        ))}
      </HStack>
    </Card>
  )
}

export default SubNavigationPills
