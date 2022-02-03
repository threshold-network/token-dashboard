import { FC } from "react"
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ListItem,
  Stack,
  UnorderedList,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { BsChevronDown, BsChevronRight } from "react-icons/all"
import { Body3 } from "../../Typography"
import { useModal } from "../../../hooks/useModal"

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

  const { closeModal } = useModal()

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: stakingProviderInUse,
  })

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
                  <Stack>
                    <Body3 color="red.500">
                      Provider address is already in use.
                    </Body3>
                    <UnorderedList pl={4} spacing={4}>
                      <ListItem>
                        For Legacy KEEP or NU operator address please go to the
                        respective legacy dashboard to top up.
                      </ListItem>
                      <ListItem>
                        For T stakes owned by this address,{" "}
                        <Button
                          fontSize="sm"
                          variant="link"
                          colorScheme="brand"
                          onClick={closeModal}
                        >
                          top up on the dashboard.
                        </Button>
                      </ListItem>
                    </UnorderedList>
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
