import { FC } from "react"
import { FormErrorMessage, FormHelperText } from "@threshold-network/components"

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
