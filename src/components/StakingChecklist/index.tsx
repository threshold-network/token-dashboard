import { FC } from "react"
import { Icon, Link, List, useTheme } from "@chakra-ui/react"
import ChecklistItem from "../ChecklistItem"
import { Body2, Body3 } from "../Typography"
import { FiArrowUpRight } from "react-icons/all"

interface StakingChecklistProps {}

const StakingChecklist: FC<StakingChecklistProps> = () => {
  const theme = useTheme()

  const stakingChecklistItems = [
    {
      title: "Node address (Operator), Beneficiary, and Authorizer addresses",
      subTitle: (
        <Body3 color="gray.500">
          These will be automatically set up to your wallet address. If you want
          to use a Staking Provider check{" "}
          <Link
            href="SOME_LINK"
            target="_blank"
            color="brand.500"
            textDecoration="underline"
          >
            this <Icon boxSize="12px" as={FiArrowUpRight} color="brand.500" />
          </Link>
        </Body3>
      ),
    },
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
            here <Icon boxSize="12px" as={FiArrowUpRight} color="brand.500" />
          </Link>
        </Body3>
      ),
    },
    {
      title: "PRE Node Worker address",
      subTitle: "Make sure you add your Worker address to gain rewards",
    },
    {
      title: "50,000 T Minimum Stake",
    },
    {
      title: (
        <Body2 color="gray.700">
          Gas costs{" "}
          <span style={{ color: theme.colors.gray["500"] }}>
            (est ~0.05 ETH)
          </span>
        </Body2>
      ),
    },
  ]
  return (
    <List spacing={6}>
      {stakingChecklistItems.map((item, i) => (
        <ChecklistItem {...item} key={i} />
      ))}
    </List>
  )
}

export default StakingChecklist
