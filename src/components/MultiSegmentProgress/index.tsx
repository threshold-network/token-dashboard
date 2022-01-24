import { FC } from "react"
import { Box, Progress, ProgressProps, Tooltip } from "@chakra-ui/react"

interface Props extends ProgressProps {
  values: {
    color: string
    value: number
    tooltip?: string
  }[]
}

const MultiSegmentProgress: FC<Props> = ({ values }) => {
  return (
    <Box position="relative">
      <Box display="flex" position="absolute" zIndex={999} w="100%" h="100%">
        {values.map(({ tooltip, value }) => (
          <Tooltip label={tooltip} key={tooltip}>
            <Box h="100%" w={`${value}%`} />
          </Tooltip>
        ))}
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
