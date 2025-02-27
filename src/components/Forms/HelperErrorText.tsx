import { FC } from "react"
import {
  Box,
  FormErrorMessage,
  FormHelperText,
} from "@threshold-network/components"

const HelperErrorText: FC<{
  errorMsgText?: string | JSX.Element
  hasError?: boolean
  helperText?: string | JSX.Element
}> = ({ errorMsgText, helperText, hasError }) => {
  return (
    <Box mt={2} maxWidth="100%" overflow="hidden" textOverflow="ellipsis">
      {hasError ? (
        <FormErrorMessage>
          {errorMsgText || "Please enter a valid value"}
        </FormErrorMessage>
      ) : helperText ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : null}
    </Box>
  )
}

export default HelperErrorText
