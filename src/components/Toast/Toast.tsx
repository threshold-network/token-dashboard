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
import { useCallback, useEffect } from "react"
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
    isDismissable = false,
    onUnmount,
    ...restProps
  } = props

  const handleUnmount = useCallback(() => {
    onUnmount && onUnmount()
  }, [onUnmount])

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleUnmount()
    }, duration)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Alert boxShadow="lg" alignItems="baseline" {...restProps}>
      <AlertIcon minH="8" />
      <Stack spacing={2} flex="1">
        {title && description && <AlertTitle>{title}</AlertTitle>}
        {(description || title) && (
          <AlertDescription>{description ?? title}</AlertDescription>
        )}
      </Stack>
      <CloseButton onClick={handleUnmount} />
    </Alert>
  )
}

export default Toast
