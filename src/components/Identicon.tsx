import { FC } from "react"
import createIdenticon from "ethereum-blockies-base64"
import { Image } from "@chakra-ui/react"

const Identicon: FC<{ address: string }> = ({ address }) => {
  return (
    <Image
      mt="2px"
      borderRadius="sm"
      h="16px"
      w="16px"
      src={createIdenticon(address)}
    />
  )
}

export default Identicon
