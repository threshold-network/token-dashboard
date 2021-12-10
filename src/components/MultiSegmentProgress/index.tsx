import { FC } from "react"
import { Box, HStack, Progress, ProgressProps, Tooltip } from "@chakra-ui/react"

interface Props extends ProgressProps {
  values: {
    [key: string]: {
      value: number
      tooltip?: string
    }
  }
}

const MultiSegmentProgress: FC<Props> = ({ values }) => {
  return (
    <Box position="relative">
      <Box display="flex" position="absolute" zIndex={999} w="100%" h="100%">
        {Object.values(values).map((value) => {
          return (
            <Tooltip label={value.tooltip} key={value.tooltip}>
              <Box h="100%" w={`${value.value}%`} />
            </Tooltip>
          )
        })}
      </Box>

      <Progress
        variant="multiSegment"
        height={4}
        min={0}
        max={100}
        // @ts-ignore
        values={values}
      />
    </Box>
  )
}

export default MultiSegmentProgress
