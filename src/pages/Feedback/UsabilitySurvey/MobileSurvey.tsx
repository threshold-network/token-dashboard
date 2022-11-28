import React, { FC } from "react"
import {
  BodyMd,
  LabelSm,
  Box,
  Radio,
  RadioGroup,
} from "@threshold-network/components"

import { Row, RowID, RowValue } from "./types"

const MobileSurvey: FC<{
  rows: Row[]
  handleRadioClick: (rowId: RowID, value: RowValue) => void
}> = ({ rows, handleRadioClick }) => {
  return (
    <>
      <Box display="flex" justifyContent={"space-between"} px={8} py={6}>
        <Box>
          <LabelSm>Strongly Disagree: 1</LabelSm>
          <LabelSm>Disagree: 2</LabelSm>
          <LabelSm>Neutral: 3</LabelSm>
        </Box>
        <Box>
          <LabelSm>Agree: 4</LabelSm>
          <LabelSm>Strongly Agree: 5</LabelSm>
        </Box>
      </Box>
      {rows.map((row, i) => {
        return (
          <Box bg={i % 2 == 0 ? "gray.50" : undefined} px={8} py={6}>
            <BodyMd mb={6}>{row.text}</BodyMd>
            <RadioGroup
              key={row.id}
              onChange={(value: RowValue) => handleRadioClick(row.id, value)}
              value={row.value}
              display="flex"
              justifyContent="space-between"
            >
              <Radio value={RowValue.StrongDisagree}>1</Radio>

              <Radio value={RowValue.Disagree}>2</Radio>

              <Radio value={RowValue.Neutral}>3</Radio>

              <Radio value={RowValue.Agree}>4</Radio>

              <Radio value={RowValue.StronglyAgree}>5</Radio>
            </RadioGroup>
          </Box>
        )
      })}
    </>
  )
}

export default MobileSurvey
