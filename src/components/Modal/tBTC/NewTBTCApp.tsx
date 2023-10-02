import {
  BodyLg,
  BodySm,
  Button,
  Divider,
  Flex,
  H5,
  Image,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@threshold-network/components"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { useTBTCTerms } from "../../../hooks/useTBTCTerms"
import tbtcAppBannerIllustration from "../../../static/images/tBTCAppBannerWithGrid.svg"
import { BaseModalProps } from "../../../types"
import { TakeNoteList } from "../../tBTC"
import withBaseModal from "../withBaseModal"

const NewTBTCAppBase: FC<BaseModalProps> = ({ closeModal }) => {
  const { accept } = useTBTCTerms()
  const navigate = useNavigate()

  return (
    <>
      <ModalHeader />
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
        <Flex justifyContent="center" px="10">
          <TakeNoteList size="sm" />
        </Flex>
        <BodySm mt="4.5rem" px="4" textAlign="center" color="gray.500">
          By clicking the button below, you acknowledge and accept the above
          terms.
        </BodySm>
        <Divider mt="2" />
      </ModalBody>
      <ModalFooter gap="4">
        <Button
          variant="outline"
          onClick={() => {
            navigate("/tBTC/how-it-works")
            closeModal()
          }}
        >
          How it Works
        </Button>
        <Button
          onClick={() => {
            accept()
            closeModal()
          }}
          data-ph-capture-attribute-button-name={`I Agree, Let's Go! (New tBTC app)`}
        >
          I Agree, Let's Go!
        </Button>
      </ModalFooter>
    </>
  )
}

export const NewTBTCApp = withBaseModal(NewTBTCAppBase)
