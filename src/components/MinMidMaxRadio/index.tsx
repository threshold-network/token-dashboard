import { FC, useState } from "react"
import { BsInfoCircleFill } from "react-icons/all"
import {
  BodySm,
  BodyXs,
  Box,
  BoxProps,
  Card,
  HStack,
  LabelMd,
  Progress,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  StackDivider,
  Tooltip,
  Icon,
} from "@threshold-network/components"

export enum MinMidMaxValue {
  Min = "MIN",
  Mid = "MID",
  Max = "MAX",
}

export interface MinMidMaxRadioProps {
  label: string
  progressValue: number
  badgeColor: string
  badgeBg: string
  badgeText: string
  tooltipLabel: string
  value: string
  setValue: (value: string) => void
  isActive: boolean
}

const SimpleBadge: FC<BoxProps> = ({ ...props }) => {
  return (
    <Box
      px={2}
      textTransform="uppercase"
      fontSize="10px"
      borderRadius="full"
      fontWeight="bold"
      display="flex"
      alignItems="center"
      {...props}
    />
  )
}

const MinMidMaxRadio: FC<MinMidMaxRadioProps> = ({
  label,
  progressValue,
  badgeColor,
  badgeBg,
  badgeText,
  tooltipLabel,
  value,
  isActive,
  setValue,
}) => {
  return (
    <Card
      py={4}
      bg={isActive ? "gray.50" : "white"}
      cursor="pointer"
      onClick={() => setValue(value)}
      borderColor={isActive ? "brand.300" : undefined}
      boxShadow="none"
    >
      <HStack
        divider={<StackDivider />}
        justifyContent="space-between"
        w="100%"
      >
        <Radio size="lg" colorScheme="brand" defaultChecked value={value}>
          <Stack ml={4}>
            <LabelMd>{label}</LabelMd>
            <Progress
              minW="88px"
              colorScheme="brand"
              value={progressValue}
              borderRadius="full"
            />
          </Stack>
        </Radio>
        <Stack spacing={0}>
          <Flex justifyContent="flex-end">
            <BodySm mr={2}>Rewards:</BodySm>
            <SimpleBadge bg={badgeBg} color={badgeColor}>
              {badgeText}
            </SimpleBadge>
          </Flex>
          <Flex alignItems="center" justifyContent="flex-end">
            <BodyXs mr={2} color="gray.500">
              Slashing Info
            </BodyXs>
            <Tooltip label={tooltipLabel}>
              <span>
                <Icon fontSize="12px" color="gray.500" as={BsInfoCircleFill} />
              </span>
            </Tooltip>
          </Flex>
        </Stack>
      </HStack>
    </Card>
  )
}

export const MinMidMaxRadioGroup: FC<{
  onRadioClick: (value: MinMidMaxValue) => any
}> = ({ onRadioClick }) => {
  const [value, setValue] = useState<MinMidMaxValue | undefined>(undefined)

  const _onRadioClick = (value: MinMidMaxValue) => {
    onRadioClick(value)
    setValue(value)
  }

  return (
    <RadioGroup
      onChange={(val) => setValue(val as MinMidMaxValue)}
      value={value}
      maxW="416px"
    >
      <Stack>
        <MinMidMaxRadio
          isActive={value === MinMidMaxValue.Min}
          value="Min"
          setValue={() => {
            _onRadioClick(MinMidMaxValue.Min)
          }}
          label="Min"
          progressValue={15}
          badgeBg="brand.100"
          badgeColor="brand.300"
          badgeText="Low"
          tooltipLabel="This is the Low radio button"
        />
        <MinMidMaxRadio
          isActive={value === MinMidMaxValue.Mid}
          value="Mid"
          setValue={() => {
            _onRadioClick(MinMidMaxValue.Mid)
          }}
          label="Mid"
          progressValue={50}
          badgeBg="brand.300"
          badgeColor="white"
          badgeText="Med"
          tooltipLabel="This is the Med radio button"
        />
        <MinMidMaxRadio
          isActive={value === MinMidMaxValue.Max}
          value="Max"
          setValue={() => {
            _onRadioClick(MinMidMaxValue.Max)
          }}
          label="Max"
          progressValue={100}
          badgeBg="gradient.3"
          badgeColor="white"
          badgeText="High"
          tooltipLabel="This is the High radio button"
        />
      </Stack>
    </RadioGroup>
  )
}
