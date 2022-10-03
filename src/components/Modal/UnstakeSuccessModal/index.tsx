import { FC } from "react"
import TransactionSuccessModal from "../TransactionSuccessModal"
import StakingStats from "../../StakingStats"
import InfoBox from "../../InfoBox"
import { H5 } from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"
import { UnstakeType, ExternalHref } from "../../../enums"
import ExternalLink from "../../ExternalLink"

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
    <ExternalLink isExternal href={ExternalHref.keepDapp}>
      here
    </ExternalLink>
  ),
  [UnstakeType.LEGACY_NU]: (
    <ExternalLink isExternal href={ExternalHref.nuDapp}>
      here
    </ExternalLink>
  ),
  [UnstakeType.ALL]: (
    <>
      <ExternalLink isExternal href={ExternalHref.keepDapp}>
        KEEP dapp
      </ExternalLink>
      {" or "}
      <ExternalLink isExternal href={ExternalHref.nuDapp}>
        NU dapp
      </ExternalLink>
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
