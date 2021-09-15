import React from "react"
import { VStack, HStack, Button, Container } from "@chakra-ui/react"
import { MdBuild } from "react-icons/md"

export default {
  title: "YourComponent",
  component: Button,
}

const Template = () => {
  const variants = ["solid", "outline", "link"]
  const sizes = ["xs", "sm", "md", "lg"]
  const colorSchemes = ["brand", "green", "red", "yellow"]

  return (
    <Container>
      <VStack spacing={4}>
        {variants.map((variant) => {
          return colorSchemes.map((colorScheme) => {
            return (
              <VStack>
                <HStack>
                  {sizes.map((size) => (
                    <Button
                      colorScheme={colorScheme}
                      variant={variant}
                      size={size}
                    >
                      Button
                    </Button>
                  ))}
                </HStack>
                <HStack>
                  {sizes.map((size) => (
                    <Button
                      colorScheme={colorScheme}
                      variant={variant}
                      size={size}
                      leftIcon={<MdBuild />}
                    >
                      Button
                    </Button>
                  ))}
                </HStack>
                <HStack>
                  {sizes.map((size) => (
                    <Button
                      colorScheme={colorScheme}
                      variant={variant}
                      size={size}
                      rightIcon={<MdBuild />}
                    >
                      Button
                    </Button>
                  ))}
                </HStack>
              </VStack>
            )
          })
        })}
      </VStack>
    </Container>
  )
}

export const ButtonStory = Template.bind({})
