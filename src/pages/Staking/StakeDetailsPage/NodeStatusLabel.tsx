import { FC, useMemo } from "react"
import { BoxLabel, Icon } from "@threshold-network/components"
import { BsCheckCircleFill, FiAlertCircle } from "react-icons/all"

const NodeStatusLabel: FC<{ status: "success" | "warning" | "error" }> = ({
  status,
}) => {
  const { text, icon } = useMemo(() => {
    switch (status) {
      case "success":
        return { text: "Launched", icon: BsCheckCircleFill, color: "green.500" }
      case "warning":
        return {
          text: "Not Authorized",
          icon: FiAlertCircle,
          color: "yellow.500",
        }
      case "error":
        return {
          text: "Not earning rewards",
          icon: FiAlertCircle,
          color: "red.500",
        }
    }
  }, [status])

  return (
    <BoxLabel status={status} icon={<Icon as={icon} />}>
      {text}
    </BoxLabel>
  )
}

export default NodeStatusLabel
