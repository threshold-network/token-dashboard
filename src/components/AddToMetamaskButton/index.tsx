import { FC, useState, useCallback } from "react"
import { Button, HStack, Image, Tooltip } from "@chakra-ui/react"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { InjectedConnector } from "@web3-react/injected-connector"
import useAddErc20ToMetamask from "../../hooks/useAddErc20ToMetamask"
import metamaskFox from "../../static/images/MetaMask-Fox.png"

const AddToMetamaskButton: FC<{ contract: Contract | null }> = ({
  contract,
}) => {
  const [isTokenAlreadyAdded, setIsTokenAlreadyAdded] = useState(false)
  const addToMetamask = useAddErc20ToMetamask(contract)

  const _addToMetamask = useCallback(async () => {
    const isTokenAlreadyAdded = await addToMetamask()
    setIsTokenAlreadyAdded(isTokenAlreadyAdded)
  }, [addToMetamask])

  const { connector } = useWeb3React()

  if (connector instanceof InjectedConnector) {
    return (
      <HStack>
        <Image height="25px" width="25px" src={metamaskFox} />
        <Tooltip
          label="Added to MetaMask!"
          closeDelay={5000}
          onClose={() => setIsTokenAlreadyAdded(false)}
          isOpen={isTokenAlreadyAdded}
        >
          <Button variant="link" colorScheme="brand" onClick={_addToMetamask}>
            Add to MetaMask
          </Button>
        </Tooltip>
      </HStack>
    )
  }

  return null
}

export default AddToMetamaskButton
