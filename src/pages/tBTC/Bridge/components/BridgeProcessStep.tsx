import { FC, useEffect } from "react"
import {
  BodyLg,
  BodySm,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  useColorModeValue,
} from "@threshold-network/components"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { ONE_SEC_IN_MILISECONDS } from "../../../../utils/date"

export type BridgeProcessStepProps = {
  title: string
  txHash?: string
  chain: ViewInBlockExplorerChain
  progressBarColor: string
  isCompleted: boolean
  onComplete: () => void
  isIndeterminate?: boolean
  progressBarValue?: number
  progressBarMaxValue?: number
  icon: JSX.Element
}

export const BridgeProcessStep: FC<BridgeProcessStepProps> = ({
  title,
  txHash,
  chain,
  progressBarValue,
  progressBarMaxValue,
  progressBarColor,
  isIndeterminate,
  isCompleted,
  onComplete,
  icon,
  children,
}) => {
  useEffect(() => {
    if (!isCompleted) return

    const timeout = setTimeout(onComplete, 10 * ONE_SEC_IN_MILISECONDS)

    return () => {
      clearTimeout(timeout)
    }
  }, [isCompleted, onComplete])

  return (
    <Flex flexDirection="column" alignItems="center" height="100%">
      <BodyLg
        color={useColorModeValue("gray.700", "gray.300")}
        mt="8"
        alignSelf="flex-start"
        fontSize="20px"
        lineHeight="24px"
      >
        {title}
      </BodyLg>

      <CircularProgress
        alignSelf="center"
        mt="6"
        value={isCompleted ? 100 : progressBarValue}
        max={isCompleted ? undefined : progressBarMaxValue}
        color={progressBarColor}
        trackColor="gray.100"
        size="160px"
        thickness="8px"
        isIndeterminate={isCompleted ? undefined : isIndeterminate}
      >
        {isCompleted && (
          <CircularProgressLabel __css={{ svg: { margin: "auto" } }}>
            {icon}
          </CircularProgressLabel>
        )}
      </CircularProgress>
      {children}
      {txHash && (
        <BodySm mt="auto" mb="8" color="gray.500" textAlign="center">
          See transaction on{" "}
          <ViewInBlockExplorer
            text={chain === "bitcoin" ? "blockstream" : "etherscan"}
            chain={chain}
            id={txHash}
            type={ExplorerDataType.TRANSACTION}
          />
        </BodySm>
      )}
    </Flex>
  )
}
