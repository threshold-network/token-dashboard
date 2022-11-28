import React, { FC } from "react"
import { Table, Th, Thead, Tbody, Tr, Td } from "@threshold-network/components"
import { Radio, RadioGroup } from "@chakra-ui/react"
import { Row, RowID, RowValue } from "./types"

const s = {
  py: 6,
  borderColor: "gray.50",
}

const firstColWidth = {
  base: "200px",
  xl: "300px",
}

const TableSurvey: FC<{
  rows: Row[]
  handleRadioClick: (rowId: RowID, value: RowValue) => void
}> = ({ rows, handleRadioClick }) => {
  return (
    <>
      <Table sx={{ tableLayout: "fixed" }}>
        <Thead>
          <Tr>
            <Th {...s} width={firstColWidth}>
              Question
            </Th>
            <Th {...s}>Strongly Disagree</Th>
            <Th {...s}>Disagree</Th>
            <Th {...s}>Neutral</Th>
            <Th {...s}>Agree</Th>
            <Th {...s}>Strongly Agree</Th>
          </Tr>
        </Thead>
      </Table>

      {/* TODO: Implement pagination */}
      {rows.map((row, i) => {
        return (
          <RadioGroup
            key={row.id}
            onChange={(value: RowValue) => handleRadioClick(row.id, value)}
            value={row.value}
          >
            <Table sx={{ tableLayout: "fixed" }} key={row.text}>
              <Tbody>
                <Tr bg={i % 2 == 0 ? "gray.50" : undefined} {...s}>
                  <Td {...s} width={firstColWidth}>
                    {row.text}
                  </Td>
                  <Td {...s}>
                    <Radio value={RowValue.StrongDisagree}>1</Radio>
                  </Td>
                  <Td {...s}>
                    <Radio value={RowValue.Disagree}>2</Radio>
                  </Td>
                  <Td {...s}>
                    <Radio value={RowValue.Neutral}>3</Radio>
                  </Td>
                  <Td {...s}>
                    <Radio value={RowValue.Agree}>4</Radio>
                  </Td>
                  <Td {...s}>
                    <Radio value={RowValue.StronglyAgree}>5</Radio>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </RadioGroup>
        )
      })}
    </>
  )
}

export default TableSurvey
