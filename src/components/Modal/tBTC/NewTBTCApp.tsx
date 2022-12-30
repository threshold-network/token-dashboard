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
import ModalCloseButton from "../ModalCloseButton"
import { TakeNoteList } from "../../tBTC"
import withBaseModal from "../withBaseModal"
import tbtcAppBannerIllustration from "../../../static/images/tBTCAppBanner.svg"

const NewTBTCAppBase = () => {
  return (
    <>
      <ModalHeader>Take note</ModalHeader>
      <ModalCloseButton />
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
        <BodySm mt="4.5rem" textAlign="center" color="gray.500">
          By clicking the button below, you agree with the terms and you are
          aware of the results.
        </BodySm>
        <Divider mt="2" />
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            console.log("TODO: on click")
          }}
        >
          I Agree, Let's Go!
        </Button>
      </ModalFooter>
    </>
  )
}

export const NewTBTCApp = withBaseModal(NewTBTCAppBase)
