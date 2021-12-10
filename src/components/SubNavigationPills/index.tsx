import { FC } from "react"
import { Box, Button, HStack, Link } from "@chakra-ui/react"
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

  return (
    <Card w="fit-content" padding={2}>
      <HStack>
        {links.map((link) => (
          <Link
            as={RouterLink}
            key={link.href}
            to={`${url}${link.href}`}
            _hover={{
              textDecoration: "none",
            }}
          >
            <Button
              colorScheme="blackAlpha"
              variant={link.isActive ? "solid" : "ghost"}
              paddingX={6}
              paddingY="6px"
              borderRadius="md"
              cursor="pointer"
            >
              {link.text}
            </Button>
          </Link>
        ))}
      </HStack>
    </Card>
  )
}

export default SubNavigationPills
