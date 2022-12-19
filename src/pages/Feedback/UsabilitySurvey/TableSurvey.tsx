import React, { FC } from "react"
import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@threshold-network/components"
import { Row, RowID, RowValue } from "./types"
import { columns } from "./index"

const firstColWidth = {
  base: "200px",
  xl: "300px",
}

const TableSurvey: FC<{
  rows: Row[]
  handleRadioClick: (rowId: RowID, value: RowValue) => void
}> = ({ rows, handleRadioClick }) => {
  const s = {
    py: 6,
    borderColor: useColorModeValue("gray.50", "gray.700"),
  }

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
          <Table sx={{ tableLayout: "fixed" }} key={row.text}>
            <Tbody>
              <Tr
                bg={
                  i % 2 == 0
                    ? useColorModeValue("gray.50", "gray.700")
                    : undefined
                }
                {...s}
              >
                <Td {...s} width={firstColWidth}>
                  {row.text}
                </Td>
                {columns.map((value, i) => (
                  <Td {...s}>
                    <Button
                      variant="sequence"
                      isActive={row.value === value}
                      onClick={() => handleRadioClick(row.id, value)}
                    >
                      {i + 1}
                    </Button>
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        )
      })}
    </>
  )
}

export default TableSurvey
