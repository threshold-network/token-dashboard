import React from "react"
import {
  Box,
  Spinner,
  VStack,
  Text,
  useColorModeValue,
} from "@threshold-network/components"

interface StarkNetLoadingStateProps {
  message?: string
}

export const StarkNetLoadingState: React.FC<StarkNetLoadingStateProps> = ({
  message = "Initializing StarkNet connection...",
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const textColor = useColorModeValue("gray.600", "gray.400")

  return (
    <Box
      p={8}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
      textAlign="center"
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text fontSize="lg" fontWeight="medium">
          {message}
        </Text>
        <Text fontSize="sm" color={textColor}>
          This may take a few moments. Please do not close this window.
        </Text>
      </VStack>
    </Box>
  )
}
