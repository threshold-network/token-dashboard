import { Button } from "@chakra-ui/react"
import { FC } from "react"
import shortenAddress from "../../utils/shortenAddress"
import { BiWalletAlt } from "react-icons/all"

const WalletButton: FC<{ onClick: () => void; account?: string | null }> = ({
  onClick,
  account,
}) => {
  if (account) {
    return <Button leftIcon={<BiWalletAlt />}>{shortenAddress(account)}</Button>
  }

  return (
    <Button leftIcon={<BiWalletAlt />} onClick={onClick}>
      Connect Wallet
    </Button>
  )
}

export default WalletButton
