import { FC } from "react"
import { Box, Icon, Link, Stack } from "@chakra-ui/react"
import { Body3 } from "../Typography"
import { FiArrowUpRight } from "react-icons/all"
import ChecklistGroup from "../ChecklistGroup"

export const StakingDepositSteps: FC = () => {
  return (
    <ChecklistGroup
      title="Step 1 - Staking Deposit"
      checklistItems={[
        {
          title:
            "Node address (Operator), Beneficiary, and Authorizer addresses",
          subTitle: (
            <Body3 color="gray.500">
              These will be automatically set up to your wallet address. If you
              want to use a Staking Provider check{" "}
              <Link
                href="SOME_LINK"
                target="_blank"
                color="brand.500"
                textDecoration="underline"
              >
                this{" "}
                <Icon boxSize="12px" as={FiArrowUpRight} color="brand.500" />
              </Link>
            </Body3>
          ),
        },
      ]}
    />
  )
}

export const PreSetupSteps: FC = () => {
  return (
    <ChecklistGroup
      title="Step 2 - PRE Setup"
      checklistItems={[
        {
          title: "Run a PRE Node",
          subTitle: (
            <Body3 color="gray.500">
              If you don't have one yet, set this up{" "}
              <Link
                href="SOME_LINK"
                target="_blank"
                color="brand.500"
                textDecoration="underline"
              >
                here{" "}
                <Icon boxSize="12px" as={FiArrowUpRight} color="brand.500" />
              </Link>
            </Body3>
          ),
        },
        {
          title: "PRE Node Worker address",
          subTitle: "Make sure you add your Worker address to gain rewards",
        },
      ]}
    />
  )
}

const StakingChecklist: FC = () => {
  return (
    <Stack>
      <Box mb={6}>
        <StakingDepositSteps />
      </Box>
      <Box>
        <PreSetupSteps />
      </Box>
    </Stack>
  )
}

export default StakingChecklist
