import React, { FC } from "react"
import { BodyMd, LabelSm, Box } from "@threshold-network/components"
import { Row, RowID, RowValue } from "./types"
import NumberButtonSequence from "../../../components/NumberButtonSequence"
import { columns } from "./index"

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
            <NumberButtonSequence
              justifyContent="space-between"
              numberOfButtons={columns.length}
              selectedButtonNum={columns.findIndex((v) => v === row.value) + 1}
              onButtonClick={(value) =>
                handleRadioClick(row.id, columns[value - 1])
              }
            />
          </Box>
        )
      })}
    </>
  )
}

export default MobileSurvey
