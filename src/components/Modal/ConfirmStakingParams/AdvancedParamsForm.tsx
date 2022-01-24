import { FC } from "react"
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

interface AdvancedParamsFormProps {
  operator: string
  setOperator: (val: string) => void
  beneficiary: string
  setBeneficiary: (val: string) => void
  authorizer: string
  setAuthorizer: (val: string) => void
  isValidAuthorizer: boolean
  isValidBeneficiary: boolean
  isValidOperator: boolean
  operatorInUse?: boolean
}

const HelperText = ({
  text,
  isInvalid,
  errorText,
}: {
  text: string
  isInvalid: boolean
  errorText?: string
}) => {
  return (
    <FormHelperText color={isInvalid ? "red.500" : "gray.500"}>
      {isInvalid ? errorText || "Please enter a valid ETH address" : text}
    </FormHelperText>
  )
}

const AdvancedParamsForm: FC<AdvancedParamsFormProps> = (props) => {
  const {
    operator,
    setOperator,
    beneficiary,
    setBeneficiary,
    authorizer,
    setAuthorizer,
    isValidAuthorizer,
    isValidBeneficiary,
    isValidOperator,
    operatorInUse = false,
  } = props

  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: operatorInUse })

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
            <FormLabel>Operator Address</FormLabel>
            <Input
              isInvalid={operatorInUse || !isValidOperator}
              errorBorderColor="red.300"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            />
            <HelperText
              text="If you are using a staking provider, this will be their provided address."
              errorText={
                operatorInUse
                  ? "Operator already in use. Please provide a different Operator address."
                  : undefined
              }
              isInvalid={!isValidOperator || operatorInUse}
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
