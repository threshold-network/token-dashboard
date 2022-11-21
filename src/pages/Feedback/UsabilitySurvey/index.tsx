import React, { useState } from "react"
import {
  Button,
  Divider,
  Table,
  Th,
  Thead,
  Tbody,
  Tr,
  Td,
  Card,
  H5,
} from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { Radio, RadioGroup } from "@chakra-ui/react"

interface Row {
  id: RowID
  text: string
  value?: RowValue
}

enum RowValue {
  StrongDisagree = "STRONGLY_DISAGREE",
  Disagree = "DISAGREE",
  Neutral = "NEUTRAL",
  Agree = "AGREE",
  StronglyAgree = "STRONGLY_AGREE",
}

enum RowID {
  FrequentUsage = "FREQUENT_USAGE",
  UnnecessarilyComplex = "UNNECESSARILY_COMPLEX",
  EasyToUse = "EASY_TO_USE",
  NeedTechnicalSupportPerson = "NEED_TECHNICAL_SUPPORT_PERSON",
  WellIntegratedFunctions = "WELL_INTEGRATED_FUNCTIONS",
  TooMuchInconsistency = "TOO_MUCH_INCONSISTENCY",
  QuickToLearn = "QUICK_TO_LEARN",
  InconvenientToUse = "INCONVENIENT_TO_USE",
  Confident = "CONFIDENT",
  HighLearningCurve = "HIGH_LEARNING_CURVE",
}

const UsabilitySurvey: PageComponent = () => {
  const [rows, setRows] = useState<Row[]>([
    {
      id: RowID.FrequentUsage,
      text: "I think that I would like to use this product frequently.",
      value: undefined,
    },
    {
      id: RowID.UnnecessarilyComplex,
      text: "I found the product unnecessarily complex.",
      value: undefined,
    },
    {
      id: RowID.EasyToUse,
      text: "I thought the product was easy to use.",
      value: undefined,
    },
    {
      id: RowID.NeedTechnicalSupportPerson,
      text: "I think I would need the support of a technical person to be able to use this product.",
      value: undefined,
    },
    {
      id: RowID.WellIntegratedFunctions,
      text: "I found the various functions in this product well integrated.",
      value: undefined,
    },
    {
      id: RowID.TooMuchInconsistency,
      text: "I thought there was too much inconsistency in the product.",
      value: undefined,
    },
    {
      id: RowID.QuickToLearn,
      text: "I would imagine that most people would learn to use this product very quickly.",
      value: undefined,
    },
    {
      id: RowID.InconvenientToUse,
      text: "I found the product inconvenient to use.",
      value: undefined,
    },
    {
      id: RowID.Confident,
      text: "I felt very confident using the product.",
      value: undefined,
    },
    {
      id: RowID.HighLearningCurve,
      text: "I need to learn a lot of things before I could get going with the product.",
      value: undefined,
    },
  ])

  const handleRadioClick = (rowId: RowID, value: RowValue) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          return {
            ...row,
            value,
          }
        }
        return row
      })
    )
  }

  const handleSubmit = () => {
    const payload = rows.map(({ id, value }) => ({
      id,
      value,
    }))

    console.log("Payload ", payload)
    // TODO: Implement post to survey data tracking source
  }

  const s = {
    py: 6,
    borderColor: "gray.50",
  }

  const firstColWidth = {
    base: "200px",
    xl: "300px",
  }

  return (
    <Card>
      <H5 mb={8}>Overall Product Usability Score</H5>
      <Divider mb={4} />
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
      <Button mt={4} onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  )
}

UsabilitySurvey.route = {
  path: "usability-survey",
  title: "Usability Survey",
  index: false,
  isPageEnabled: true,
}

export default UsabilitySurvey
