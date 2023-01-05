import React, { useState } from "react"
import {
  BodyLg,
  BodySm,
  Box,
  Button,
  Card,
  Divider,
  FileUploader,
  H5,
  Select,
  Stack,
  Textarea,
} from "@threshold-network/components"
import { PageComponent } from "../../../types"
import useGCloudStorage from "../../../hooks/useGCloudStorage"
import Link from "../../../components/Link"
import { ExternalHref, ModalType } from "../../../enums"
import { useCapture } from "../../../hooks/posthog"
import { PosthogEvent } from "../../../types/posthog"
import { useModal } from "../../../hooks/useModal"
import { FeedbackSubmissionType } from "../../../components/Modal/FeedbackSubmissionModal"

const featureCategoryOptions = ["Upgrade", "Staking"]

const Suggestions: PageComponent = () => {
  const captureSuggestionSubmit = useCapture(
    PosthogEvent.SuggestionSubmit,
    true
  )
  const [file, setFile] = useState<File | null>(null)
  const { openModal } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const uploadToGCP = useGCloudStorage()
  const [featureCategory, setFeatureCategory] = useState("")
  const [suggestionText, setSuggestionText] = useState("")

  const handleSubmit = async () => {
    setIsLoading(true)
    let fileLink = ""
    if (file) {
      fileLink = await uploadToGCP(file)
    }

    captureSuggestionSubmit({
      file: fileLink,
      category: featureCategory,
      suggestion: suggestionText,
    })

    setIsLoading(false)
    openModal(ModalType.FeedbackSubmission, {
      type: FeedbackSubmissionType.Suggestion,
    })
  }

  return (
    <Card>
      <Stack spacing={8}>
        <H5>What suggestions do you have?</H5>
        <Divider />
        <BodyLg>
          Submit your suggestions for product improvements by using this form.
          To discuss ideas with other Threshold users and DAO members, consider
          posting it in the{" "}
          <Link href={ExternalHref.thresholdDiscord} isExternal>
            Discord
          </Link>
        </BodyLg>
        <Box>
          <BodySm mb={2} fontWeight="bold">
            Feature Category:
          </BodySm>
          <Select
            placeholder="Select option"
            value={featureCategory}
            onChange={(e) => setFeatureCategory(e.target.value)}
          >
            {featureCategoryOptions.map((opt) => (
              <option value={opt} key={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </Box>
        <Box>
          <BodySm mb={2} fontWeight="bold">
            Suggestions
          </BodySm>
          <Textarea
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}
            placeholder="Enter text"
            minH="220px"
          />
        </Box>
        <FileUploader
          onFileUpload={(file) => setFile(file)}
          headerHelperText="Optional"
          footerHelperText="File can be video or photo. Must be less than 2MB"
          accept="image/*"
          m="auto"
          w="full"
          maxW="full"
        />
        <Button
          isLoading={isLoading}
          disabled={suggestionText === "" || featureCategory === ""}
          onClick={handleSubmit}
        >
          Submit Suggestion
        </Button>
      </Stack>
    </Card>
  )
}

Suggestions.route = {
  path: "suggestions",
  title: "Suggestions",
  index: false,
  isPageEnabled: true,
}

export default Suggestions
