import {
  Box,
  Card,
  Radio,
  useRadio,
  RadioProps,
} from "@threshold-network/components"
import theme from "../../../theme"

const RadioCard = (props: RadioProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Card
        {...checkbox}
        boxShadow="none"
        cursor="pointer"
        display="flex"
        _checked={{
          border: `2px solid ${theme.colors.brand[400]}`,
        }}
        p={4}
      >
        {/*  @ts-ignore*/}
        <Radio isChecked={input.checked} />
        <Box>{props.children}</Box>
      </Card>
    </Box>
  )
}

export default RadioCard
