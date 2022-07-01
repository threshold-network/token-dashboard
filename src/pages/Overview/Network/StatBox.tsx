import { FC } from "react"
import { BodyMd, H2 } from "@threshold-network/components"
import InfoBox from "../../../components/InfoBox"

const StatBox: FC<{ value: number | string; text: string }> = ({
  value,
  text,
}) => {
  return (
    <InfoBox>
      <H2 textAlign="center">{value}</H2>
      <BodyMd textAlign="center">{text}</BodyMd>
    </InfoBox>
  )
}

export default StatBox
