import { FC } from "react"
import { Stack } from "@chakra-ui/react"
import UpgradeStats from "./UpgradeStats"
import { useTExchangeRate } from "../../../hooks/useTExchangeRate"
import withBaseModal from "../withBaseModal"
import { BaseModalProps, UpgredableToken } from "../../../types"
import TransactionSuccessModal from "../TransactionSuccessModal"
// import AddToMetamaskButton from "../../AddToMetamaskButton"
import { useT } from "../../../web3/hooks"

interface UpgradeSuccessProps extends BaseModalProps {
  upgradedAmount: string
  receivedAmount: string
  transactionHash: string
  token: UpgredableToken
}

const UpgradeSuccess: FC<UpgradeSuccessProps> = ({
  upgradedAmount,
  receivedAmount,
  transactionHash,
  token,
}) => {
  const { formattedAmount: exchangeRate } = useTExchangeRate(token)
  const T = useT()

  return (
    <TransactionSuccessModal
      subTitle="Your upgrade was successful!"
      transactionHash={transactionHash}
      body={
        <Stack spacing={12}>
          <UpgradeStats
            token={token}
            exchangeRate={exchangeRate}
            receivedAmount={receivedAmount}
            upgradedAmount={upgradedAmount}
          />
          {/* <Flex justify="center">
            <AddToMetamaskButton contract={T?.contract} />
          </Flex> */}
        </Stack>
      }
    />
  )
}

export default withBaseModal(UpgradeSuccess)
