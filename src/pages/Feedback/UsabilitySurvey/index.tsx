import React, { useState } from "react"
import { Button, Divider, Card, H5 } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { Row, RowID, RowValue } from "./types"
import TableSurvey from "./TableSurvey"
import MobileSurvey from "./MobileSurvey"
import useChakraBreakpoint from "../../../hooks/useChakraBreakpoint"

export const columns: RowValue[] = [
  RowValue.StrongDisagree,
  RowValue.Disagree,
  RowValue.Neutral,
  RowValue.Agree,
  RowValue.StronglyAgree,
]

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
    setRows((rows) =>
      rows.map((row) => (row.id === rowId ? { ...row, value } : row))
    )
  }

  const handleSubmit = () => {
    // const payload = rows.map(({ id, value }) => ({
    //   id,
    //   value,
    // }))
    // TODO: Implement post to survey data tracking source
  }

  const isSmallScreen = useChakraBreakpoint("xl")

  return (
    <Card>
      <H5 mb={8}>Overall Product Usability Score</H5>
      <Divider mb={4} />
      {isSmallScreen ? (
        <MobileSurvey rows={rows} handleRadioClick={handleRadioClick} />
      ) : (
        <TableSurvey rows={rows} handleRadioClick={handleRadioClick} />
      )}

      <Button mt={4} onClick={handleSubmit} isFullWidth={isSmallScreen}>
        Submit Survey
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
