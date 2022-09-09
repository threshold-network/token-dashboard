import { FC, Fragment, ReactElement } from "react"
import { BodyMd } from "@threshold-network/components"
import { TreeItem, TreeItemLineToNode } from "../../../../../components/Tree"
import InfoBox from "../../../../../components/InfoBox"
import TokenBalance from "../../../../../components/TokenBalance"

export const BalanceTreeItem: FC<{
  label: string | ReactElement
  value: string
  isRoot?: boolean
}> = ({ label, value, children, isRoot = false }) => {
  const LineComponent = isRoot ? Fragment : TreeItemLineToNode
  return (
    <TreeItem>
      <BodyMd fontWeight="400" pt="6" pb="3">
        {label}
      </BodyMd>
      <LineComponent>
        <InfoBox m="0">
          <TokenBalance tokenAmount={value} withSymbol tokenSymbol="T" />
        </InfoBox>
      </LineComponent>
      {children}
    </TreeItem>
  )
}
