import { useReduxToken } from "../hooks/useReduxToken"
import { useKeep } from "../web3/hooks/useKeep"
import TokenBalanceInput from "./TokenBalanceInput"
import KeepLight from "../static/icons/KeepLight"
import { Stack, Text } from "@chakra-ui/react"
import { useState } from "react"

export const ScratchPad = ({}) => {
  const { keep } = useReduxToken()
  const { fetchBalance } = useKeep()

  const [keepAmount, setKeepAmount] = useState<string | number>("")

  if (keep.loading) {
    return <div>LOADING</div>
  }
  return (
    <Stack spacing={4} maxW="md" mt={8}>
      {keep.balance} <button onClick={fetchBalance}>Fetch again</button>{" "}
      <TokenBalanceInput
        amount={keepAmount}
        setAmount={setKeepAmount}
        max={keep.balance}
        icon={KeepLight}
      />
      <Text mt={4}>The actual amount to upgrade: {+keepAmount} KEEP</Text>
    </Stack>
  )
}
