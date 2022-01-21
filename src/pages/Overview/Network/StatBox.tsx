import { FC } from "react"
import { Body2, H2 } from "../../../components/Typography"
import InfoBox from "../../../components/InfoBox"

const StatBox: FC<{ value: number | string; text: string }> = ({
  value,
  text,
}) => {
  return (
    <InfoBox>
      <H2 textAlign="center">{value}</H2>
      <Body2 textAlign="center">{text}</Body2>
    </InfoBox>
  )
}

export default StatBox
