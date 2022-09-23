import React, { FC } from "react"
import { Alert, AlertIcon, BodyXs } from "@threshold-network/components"

const NodeStatusLabel: FC<{ isAuthorized: boolean }> = ({ isAuthorized }) => {
  return (
    <Alert p={2} status={isAuthorized ? "success" : "error"} w="fit-content">
      <AlertIcon boxSize="16px" />
      <BodyXs>{isAuthorized ? "" : "Not"} Authorized</BodyXs>
    </Alert>
  )
}

export default NodeStatusLabel
