import useAddErc20ToMetamask from "../../hooks/useAddErc20ToMetamask"
import metamaskFox from "../../static/images/MetaMask-Fox.png"
import { Button, HStack, Image } from "@chakra-ui/react"
import { Contract } from "@ethersproject/contracts"
import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"

const AddToMetamaskButton: FC<{ contract: Contract | null }> = ({
  contract,
}) => {
  const addToMetamask = useAddErc20ToMetamask(contract)

  const { connector } = useWeb3React()

  if (connector instanceof InjectedConnector) {
    return (
      <HStack>
        <Image height="25px" width="25px" src={metamaskFox} />
        <Button variant="link" colorScheme="brand" onClick={addToMetamask}>
          Add to MetaMask
        </Button>
      </HStack>
    )
  }

  return null
}

export default AddToMetamaskButton
