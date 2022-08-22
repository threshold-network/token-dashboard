import { FC } from "react"
import { FormErrorMessage, FormHelperText } from "@chakra-ui/react"

const HelperErrorText: FC<{
  errorMsgText?: string | JSX.Element
  hasError?: boolean
  helperText?: string | JSX.Element
}> = ({ errorMsgText, helperText, hasError }) => {
  if (hasError) {
    return typeof errorMsgText === "string" ? (
      <FormErrorMessage>{errorMsgText}</FormErrorMessage>
    ) : (
      errorMsgText || (
        <FormErrorMessage>Please enter a valid value</FormErrorMessage>
      )
    )
  } else {
    return typeof helperText === "string" ? (
      <FormHelperText>{helperText}</FormHelperText>
    ) : (
      helperText || null
    )
  }
}

export default HelperErrorText
