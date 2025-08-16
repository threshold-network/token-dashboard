import React from "react"
import {
  Box,
  VStack,
  Text,
  Button,
  Icon,
  useColorModeValue,
} from "@threshold-network/components"
import { FiAlertCircle } from "react-icons/fi"

interface StarkNetErrorStateProps {
  error: string
  onRetry: () => void
}

export const StarkNetErrorState: React.FC<StarkNetErrorStateProps> = ({
  error,
  onRetry,
}) => {
  const bgColor = useColorModeValue("red.50", "red.900")
  const borderColor = useColorModeValue("red.200", "red.700")
  const textColor = useColorModeValue("red.600", "red.400")
  const iconColor = useColorModeValue("red.500", "red.300")

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
        <Icon as={FiAlertCircle} boxSize={12} color={iconColor} />
        <Text fontSize="lg" fontWeight="medium">
          StarkNet Initialization Failed
        </Text>
        <Text fontSize="sm" color={textColor} maxW="md">
          {error}
        </Text>
        <Button onClick={onRetry} colorScheme="brand" size="md">
          Try Again
        </Button>
      </VStack>
    </Box>
  )
}
