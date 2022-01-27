import { FC, useCallback } from "react"
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { BsChevronDown, BsChevronRight } from "react-icons/all"
import { Body3 } from "../../Typography"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { useStakingState } from "../../../hooks/useStakingState"

interface AdvancedParamsFormProps {
  stakingProvider: string
  setStakingProvider: (val: string) => void
  beneficiary: string
  setBeneficiary: (val: string) => void
  authorizer: string
  setAuthorizer: (val: string) => void
  isValidAuthorizer: boolean
  isValidBeneficiary: boolean
  isValidStakingProvider: boolean
  stakingProviderInUse?: boolean
}

const HelperText = ({
  text,
  isInvalid,
  errorText,
}: {
  text: string
  isInvalid: boolean
  errorText?: string | JSX.Element
}) => {
  return (
    <FormHelperText color={isInvalid ? "red.500" : "gray.500"}>
      {isInvalid ? errorText || "Please enter a valid ETH address" : text}
    </FormHelperText>
  )
}

const AdvancedParamsForm: FC<AdvancedParamsFormProps> = (props) => {
  const {
    stakingProvider,
    setStakingProvider,
    beneficiary,
    setBeneficiary,
    authorizer,
    setAuthorizer,
    isValidAuthorizer,
    isValidBeneficiary,
    isValidStakingProvider,
    stakingProviderInUse = false,
  } = props

  const { openModal } = useModal()

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: stakingProviderInUse,
  })

  const { stakeAmount } = useStakingState()

  const openTopupModal = useCallback(() => {
    openModal(ModalType.TopupT, { initialTopupAmount: stakeAmount })
  }, [stakeAmount])

  return (
    <Box>
      <Button
        variant="link"
        color={useColorModeValue("brand.500", "white")}
        onClick={onToggle}
        mb={6}
        rightIcon={isOpen ? <BsChevronDown /> : <BsChevronRight />}
      >
        Customize these addresses
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Stack spacing={6} mb={6}>
          <FormControl>
            <FormLabel>Staking Provider Address</FormLabel>
            <Input
              isInvalid={stakingProviderInUse || !isValidStakingProvider}
              errorBorderColor="red.300"
              value={stakingProvider}
              onChange={(e) => setStakingProvider(e.target.value)}
            />
            <HelperText
              text="If you are using a staking provider, this will be their provided address."
              errorText={
                stakingProviderInUse ? (
                  <Stack direction="row">
                    <Body3 color="red.500">
                      Staking Provider is already in use. Did you mean to{" "}
                    </Body3>
                    <Button
                      variant="link"
                      colorScheme="brand"
                      onClick={openTopupModal}
                    >
                      top up your stake
                    </Button>
                    <Body3 color="red.500"> ?</Body3>
                  </Stack>
                ) : undefined
              }
              isInvalid={!isValidStakingProvider || stakingProviderInUse}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Beneficiary Address</FormLabel>
            <Input
              isInvalid={!isValidBeneficiary}
              errorBorderColor="red.300"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
            />
            <HelperText
              text="This address will receive rewards"
              isInvalid={!isValidBeneficiary}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Authorizer Address</FormLabel>
            <Input
              isInvalid={!isValidAuthorizer}
              errorBorderColor="red.300"
              value={authorizer}
              onChange={(e) => setAuthorizer(e.target.value)}
            />
            <HelperText
              text="This address will authorize applications."
              isInvalid={!isValidAuthorizer}
            />
          </FormControl>
        </Stack>
      </Collapse>
    </Box>
  )
}

export default AdvancedParamsForm
