import { FC } from "react"
import { Icon, Tooltip } from "@chakra-ui/react"
import { InfoIcon } from "@chakra-ui/icons"
import { Tree, TreeNode } from "../../../../../components/Tree"
import { BalanceTreeItem } from "./BalanceTreeItem"

const LegacyStakeBalances: FC<{
  nuInTStake: string
  keepInTStake: string
  tStake: string
  totalInTStake: string
}> = ({ nuInTStake, keepInTStake, tStake, totalInTStake }) => {
  return (
    <Tree>
      <TreeNode isRoot>
        <BalanceTreeItem
          isRoot
          label={
            <>
              Total Staked Balance{" "}
              <Tooltip
                label="Staked Balance for Legacy Stakes are cumulated KEEP, NU and T staked tokens displayed in T."
                fontSize="md"
                bg="white"
                color="gray.700"
                textAlign="center"
                p="2"
                offset={[150, 10]}
                hasArrow
              >
                <Icon as={InfoIcon} />
              </Tooltip>
            </>
          }
          value={totalInTStake}
        >
          <TreeNode>
            <BalanceTreeItem label="Native Stake" value={tStake} />
            {keepInTStake !== "0" && (
              <BalanceTreeItem label="KEEP Stake in T" value={keepInTStake} />
            )}
            {nuInTStake !== "0" && (
              <BalanceTreeItem label="NU Stake in T" value={nuInTStake} />
            )}
          </TreeNode>
        </BalanceTreeItem>
      </TreeNode>
    </Tree>
  )
}

export default LegacyStakeBalances
