import { FC } from "react"
import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  BodyLg,
  H5,
  BodySm,
  Flex,
  Image,
} from "@threshold-network/components"
import { TakeNoteList } from "../../tBTC"
import withBaseModal from "../withBaseModal"
import tbtcAppBannerIllustration from "../../../static/images/tBTCAppBannerWithGrid.svg"
import { useTBTCTerms } from "../../../hooks/useTBTCTerms"
import { BaseModalProps } from "../../../types"
import { PosthogEvent } from "../../../types/posthog"
import { useCapture } from "../../../hooks/posthog"
import { TrackingButton } from "../../TrackingButton/TrackingButton"

const NewTBTCAppBase: FC<BaseModalProps> = ({ closeModal }) => {
  const { accept } = useTBTCTerms()
  const captureButtonClick = useCapture(PosthogEvent.ButtonClicked)

  return (
    <>
      <ModalHeader>Take note</ModalHeader>
      <ModalBody>
        <Image
          src={tbtcAppBannerIllustration}
          maxH={{ base: "140px", xl: "unset" }}
          mx="auto"
          mb="14"
        />
        <H5 mb="2">The NEW tBTC dApp is here!</H5>
        <BodyLg mb="12" color="gray.500">
          Take note of the following before you proceed.
        </BodyLg>
        <Flex justifyContent="center">
          <TakeNoteList size="sm" />
        </Flex>
        <BodySm mt="4.5rem" px="4" textAlign="center" color="gray.500">
          By clicking the button below, you agree with the terms and you are
          aware of the results.
        </BodySm>
        <Divider mt="2" />
      </ModalBody>
      <ModalFooter>
        <TrackingButton
          onClick={() => {
            accept()
            closeModal()
          }}
          capturedButtonName={"I Agree, Let's Go! (New tBTC app)"}
        >
          I Agree, Let's Go!
        </TrackingButton>
      </ModalFooter>
    </>
  )
}

export const NewTBTCApp = withBaseModal(NewTBTCAppBase)
