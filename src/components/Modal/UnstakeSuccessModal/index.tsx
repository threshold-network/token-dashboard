import { FC } from "react"
import TransactionSuccessModal from "../TransactionSuccessModal"
import StakingStats from "../../StakingStats"
import InfoBox from "../../InfoBox"
import { H5 } from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"
import { UnstakeType, ExternalHref } from "../../../enums"
import Link from "../../Link"

interface UnstakeSuccessProps extends BaseModalProps {
  transactionHash: string
  stake: StakeData
  unstakeAmount: string | number
  unstakeType: UnstakeType
}

type UnstakeTypeWithoutNative =
  | UnstakeType.LEGACY_KEEP
  | UnstakeType.LEGACY_NU
  | UnstakeType.ALL

const unstakeTypeToLegacyDappLink: Record<
  UnstakeTypeWithoutNative,
  JSX.Element
> = {
  [UnstakeType.LEGACY_KEEP]: (
    <Link isExternal href={ExternalHref.keepDapp}>
      here
    </Link>
  ),
  [UnstakeType.LEGACY_NU]: (
    <Link isExternal href={ExternalHref.nuDapp}>
      here
    </Link>
  ),
  [UnstakeType.ALL]: (
    <>
      <Link isExternal href={ExternalHref.keepDapp}>
        KEEP dapp
      </Link>
      {" or "}
      <Link isExternal href={ExternalHref.nuDapp}>
        NU dapp
      </Link>
    </>
  ),
}

const UnstakingSuccessModal: FC<UnstakeSuccessProps> = ({
  transactionHash,
  stake,
  unstakeAmount,
  unstakeType,
}) => {
  const { beneficiary, stakingProvider, authorizer } = stake

  return (
    <TransactionSuccessModal
      subTitle="Your unstake was successful!"
      transactionHash={transactionHash}
      body={
        <>
          {unstakeType !== UnstakeType.NATIVE && (
            <InfoBox variant="modal">
              <H5>
                Make sure you go to the legacy dashboard and undelegate your
                tokens - {unstakeTypeToLegacyDappLink[unstakeType]}.
              </H5>
            </InfoBox>
          )}
          <StakingStats
            {...{
              stakeAmount: unstakeAmount,
              amountText: "Unstaked amount",
              beneficiary,
              stakingProvider,
              authorizer,
            }}
          />
        </>
      }
    />
  )
}

export default withBaseModal(UnstakingSuccessModal)
