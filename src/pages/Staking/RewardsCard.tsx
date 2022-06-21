import { FC } from "react"
import { Button } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import {
  Box,
  BodyMd,
  BodySm,
  LabelSm,
  Card,
  Divider,
  HStack,
  Badge,
} from "@threshold-network/components"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"

const RewardsCard: FC<{
  totalRewardsBalance: string
  totalBonusBalance: string
}> = ({ totalRewardsBalance, totalBonusBalance }) => {
  const { active } = useWeb3React()
  const { openModal } = useModal()

  return (
    <Card>
      <LabelSm textTransform="uppercase">Rewards</LabelSm>
      <HStack mt="6">
        <BodyMd>Total Rewards</BodyMd>
        <Badge variant="magic" ml="auto !important">
          staking bonus
        </Badge>
      </HStack>
      <InfoBox mt="2" direction="row" p="4" alignItems="center">
        {active ? (
          <>
            <TokenBalance
              tokenAmount={totalRewardsBalance}
              withSymbol
              tokenSymbol="T"
              isLarge
            />
            <Box
              display="flex"
              flex="0.3"
              my="-10"
              py="5"
              borderLeft="1px solid"
              borderColor="gray.300"
              marginLeft="auto !important"
            >
              <Box ml="auto">
                {/* TODO: rebuild TokenBalance component to pass style props to the main wrapper to avoid multiple div wrappers */}
                <TokenBalance
                  ml="auto"
                  tokenAmount={totalBonusBalance}
                  withSymbol
                  tokenSymbol="T"
                />
              </Box>
            </Box>
          </>
        ) : (
          <BodyMd>
            Rewards are released at the end of each month and can be claimed
            retroactively for March and April.
          </BodyMd>
        )}
      </InfoBox>

      <Button
        mt="4"
        variant="outline"
        size="lg"
        disabled={!active}
        isFullWidth
        onClick={() =>
          openModal(ModalType.ClaimingRewards, {
            totalRewardsBalance: "0",
            rewards: [
              {
                beneficiary: "0x670a0D9b1f5759c5B1021fa5BDb9619c5cA3E3af",
                rewardsAmount: "1000000000000000000000",
              },
            ],
          })
        }
      >
        Claim All
      </Button>
    </Card>
  )
}

export default RewardsCard
