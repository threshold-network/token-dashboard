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
}

const HelperText = ({
  text,
  isInvalid,
}: {
  text: string
  isInvalid: boolean
}) => {
  return (
    <FormHelperText color={isInvalid ? "red.500" : "gray.500"}>
      {isInvalid ? "Please enter a valid ETH address" : text}
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
  } = props

  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false })

  return (
    <Box>
      <Button
        variant="link"
        color="purple.600"
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
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            />
            <HelperText
              text="If you are using a staking provider, this will be their provided address."
              isInvalid={!isValidOperator}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Beneficiary Address</FormLabel>
            <Input
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
