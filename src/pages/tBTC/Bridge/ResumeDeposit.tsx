import {
  BodyLg,
  BodyMd,
  Box,
  Button,
  FileUploader,
} from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { TbtcMintingCardTitle } from "./components/TbtcMintingCardTitle"
import { BridgeContractLink } from "../../../components/tBTC"

export const ResumeDepositPage: PageComponent = () => {
  return (
    <>
      <TbtcMintingCardTitle />
      <BodyLg>
        <Box as="span" fontWeight="600" color="brand.500">
          Resume Minting
        </Box>{" "}
        - Upload JSON. file
      </BodyLg>
      <BodyMd mt="3" mb="6">
        To resume your minting you need to upload your .JSON file and sign the
        Minting Initiation transaction triggered in the dApp.
      </BodyMd>
      <FileUploader
        onFileUpload={() => console.log("file uploaded")}
        headerHelperText="Require"
        accept="application/JSON"
      />
      <Button
        size="lg"
        isFullWidth
        onClick={() => {
          console.log(
            "set data from json file to localstorage and redirect to tBTC mint page"
          )
        }}
        mt="6"
      >
        Upload and Resume
      </Button>
      <Box as="p" textAlign="center" mt="10">
        <BridgeContractLink />
      </Box>
    </>
  )
}

ResumeDepositPage.route = {
  path: "continue",
  index: false,
  isPageEnabled: true,
}
