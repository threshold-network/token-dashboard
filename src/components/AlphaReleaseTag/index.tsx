import { FC } from "react"
import { Badge, Box } from "@chakra-ui/react"
import { useSidebar } from "../../hooks/useSidebar"

const AlphaReleaseTag: FC = () => {
  const { isOpen } = useSidebar()
  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Badge
        colorScheme="purple"
        variant="subtle"
        borderRadius="sm"
        fontSize={isOpen ? 16 : 10}
      >
        Alpha {isOpen && "Release"}
      </Badge>
    </Box>
  )
}

export default AlphaReleaseTag
