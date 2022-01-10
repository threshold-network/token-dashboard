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
import { BsChevronRight, BsChevronDown } from "react-icons/all"

interface AdvancedParamsFormProps {
  operator: string
  setOperator: (val: string) => void
  beneficiary: string
  setBeneficiary: (val: string) => void
  authorizer: string
  setAuthorizer: (val: string) => void
}

const AdvancedParamsForm: FC<AdvancedParamsFormProps> = (props) => {
  const {
    operator,
    setOperator,
    beneficiary,
    setBeneficiary,
    authorizer,
    setAuthorizer,
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
            <FormHelperText>
              If you are using a staking provider, this will be their provided
              address.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Beneficiary Address</FormLabel>
            <Input
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
            />
            <FormHelperText>This address will receive rewards</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Authorizer Address</FormLabel>
            <Input
              value={authorizer}
              onChange={(e) => setAuthorizer(e.target.value)}
            />
            <FormHelperText>
              This address will authorize applications.
            </FormHelperText>
          </FormControl>
        </Stack>
      </Collapse>
    </Box>
  )
}

export default AdvancedParamsForm
