import {
  AlertStatus,
  Alert,
  AlertIcon,
  Stack,
  AlertTitle,
  AlertDescription,
  AlertProps as AlertPropsBase,
  CloseButton,
} from "@threshold-network/components"
import { useEffect, useState } from "react"
import { setTimeout, clearTimeout } from "../../utils/setTimeout"

export interface ToastInternalProps {
  id: number
  onUnmount?: () => void
}
export interface ToastProps {
  title: string
  status: AlertStatus
  description?: string
  duration?: number
  isDismissable?: boolean
}
type AlertProps = AlertPropsBase & ToastProps & Omit<ToastInternalProps, "id">

const Toast = (props: AlertProps) => {
  const {
    title,
    description,
    duration = Infinity,
    isDismissable = true,
    ...restProps
  } = props

  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(false)
    }, duration)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted ? (
    <Alert
      position="absolute"
      top="0"
      left="50%"
      transform="translateX(-50%)"
      width="auto"
      boxShadow="lg"
      alignItems="baseline"
      border="none"
      whiteSpace="nowrap"
      {...restProps}
    >
      <AlertIcon minH="8" />
      <Stack spacing={2} flex="1">
        {title && description && <AlertTitle>{title}</AlertTitle>}
        {(description || title) && (
          <AlertDescription>{description ?? title}</AlertDescription>
        )}
      </Stack>
      {isDismissable && (
        <CloseButton onClick={() => setIsMounted(false)} ml="4" />
      )}
    </Alert>
  ) : (
    <></>
  )
}

export default Toast
