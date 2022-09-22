import { FC, useMemo } from "react"
import { Alert, AlertIcon, BodyXs } from "@threshold-network/components"

const NodeStatusLabel: FC<{ status: "success" | "warning" | "error" }> = ({
  status,
}) => {
  const text = useMemo(() => {
    switch (status) {
      case "success":
        return "Launched"
      case "warning":
        return "Not authorized"
      case "error":
        return "Not earning rewards"
    }
  }, [status])

  return (
    <Alert p={2} status={status} w="fit-content">
      <AlertIcon boxSize="16px" />
      <BodyXs>{text}</BodyXs>
    </Alert>
  )
}

export default NodeStatusLabel
