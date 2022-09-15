import { FC } from "react"
import { FormErrorMessage, FormHelperText } from "@chakra-ui/react"

const HelperErrorText: FC<{
  errorMsgText?: string | JSX.Element
  hasError?: boolean
  helperText?: string | JSX.Element
}> = ({ errorMsgText, helperText, hasError }) => {
  if (hasError) {
    return (
      <FormErrorMessage>
        {errorMsgText || "Please enter a valid value"}
      </FormErrorMessage>
    )
  }

  return helperText ? <FormHelperText>{helperText}</FormHelperText> : null
}

export default HelperErrorText
