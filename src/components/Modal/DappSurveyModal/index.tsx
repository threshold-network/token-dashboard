import { FC, useState } from "react"
import {
  Box,
  Button,
  Divider,
  H5,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  RadioGroup,
  Stack,
  Textarea,
  useRadioGroup,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import InfoBox from "../../InfoBox"
import { PosthogEvent } from "../../../types/posthog"
import RadioCard from "./RadioCard"

interface SurveyQuestion {
  text: string
  value: string
}

interface DappSurveyModalProps extends BaseModalProps {
  title: string
  captureEvent: PosthogEvent
  surveyQuestions: SurveyQuestion[]
}

const DappSurveyModal: FC<DappSurveyModalProps> = ({
  closeModal,
  title,
  captureEvent,
  surveyQuestions,
}) => {
  const [value, setValue] = useState("")
  const [extraInfo, setExtraInfo] = useState("")

  const handleSubmit = () => {
    console.log("post hog capture ", captureEvent)
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    defaultValue: "",
    onChange: setValue,
  })

  const group = getRootProps()

  return (
    <>
      <ModalHeader>dApp Survey</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox>
          <H5 mb={2}>{title}</H5>
        </InfoBox>
        <Box px={4} my={4}>
          <RadioGroup onChange={setValue} value={value}>
            <Stack spacing={2} {...group}>
              {surveyQuestions.map(({ value, text }) => {
                const radio = getRadioProps({ value })
                return (
                  <RadioCard key={value} {...radio}>
                    {text}
                  </RadioCard>
                )
              })}
            </Stack>
          </RadioGroup>
          {value === "OTHER" && (
            <Textarea
              mt={2}
              placeholder="Type your reasons here"
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            />
          )}
        </Box>
        <Divider />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button disabled={value === ""} onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(DappSurveyModal)
