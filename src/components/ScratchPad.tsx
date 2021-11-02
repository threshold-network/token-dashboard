import { useState } from "react"
import { useReduxToken } from "../hooks/useReduxToken"
import { Stack } from "@chakra-ui/react"
import UpgradeCard from "./UpgradeCard"
import { Token } from "../enums"

export const ScratchPad = ({}) => {
  const { keep } = useReduxToken()
  const [keepAmount, setKeepAmount] = useState<string | number>("")

  if (keep.loading) {
    return <div>LOADING</div>
  }

  return (
    <Stack spacing={4} maxW="md" mt={8}>
      <UpgradeCard token={Token.Keep} />
      <UpgradeCard token={Token.Nu} />
    </Stack>
  )
}
