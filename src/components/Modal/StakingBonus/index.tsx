import { FC, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { ConnectWallet } from "./ConnectWallet"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { CheckEligibility } from "./CheckEligibility"
import { EligibilityConfirmation } from "./EligibilityConfirmation"
import { BonusEligibility } from "../../../types/staking"

const StakingBonusModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { active } = useWeb3React()
  const [isFetching, setIsFetching] = useState(false)
  const [bonusEligibility, setBonusEligibility] =
    useState<BonusEligibility | null>(null)

  return (
    <>
      {!active && <ConnectWallet closeModal={closeModal} />}
      {active && (
        <CheckEligibility
          closeModal={closeModal}
          onSubmit={(values) => console.log("form values", values)}
        />
      )}
      {bonusEligibility && (
        <EligibilityConfirmation
          closeModal={closeModal}
          bonusEligibility={bonusEligibility}
        />
      )}
    </>
  )
}

export default withBaseModal(StakingBonusModal)
