import React, { ComponentProps, FC } from "react"
import { BodyMd, Card, H5, Image, Stack } from "@threshold-network/components"
import LearnAboutStakingIllustration from "../../../static/images/LearnAboutStakingIllustration.png"
import ViewInBlockExplorer from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"

export const LearnAboutStaking: FC<
  ComponentProps<typeof Card> & { tStakingContractAddress: string }
> = ({ tStakingContractAddress }) => {
  return (
    <Card px={{ base: undefined, xl: "72px" }} mb={4}>
      <Stack
        direction={{ base: "column", xl: "row" }}
        justifyContent="space-between"
      >
        <Image
          maxW="280px"
          src={LearnAboutStakingIllustration}
          mx={{ base: "auto !important", xl: "0 !important" }}
          mb={{ base: "16px !important", xl: "0 !important" }}
        />
        <Stack maxW="528px">
          <H5>
            Learn more about how to participate in Threshold staking below
          </H5>
          <BodyMd mt="5">
            The{" "}
            <ViewInBlockExplorer
              id={tStakingContractAddress}
              type={ExplorerDataType.ADDRESS}
              text="Threshold Staking Contract"
            />{" "}
            supports two types of stakes: Legacy Stakes (NU and KEEP stakes) and
            New T Stakes.
          </BodyMd>
        </Stack>
      </Stack>
    </Card>
  )
}
