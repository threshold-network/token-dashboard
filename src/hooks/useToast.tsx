import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  AlertProps as AlertPropsBase,
  AlertStatus,
  CloseButton,
  Box,
} from "@threshold-network/components"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import {
  addToast as addToastAction,
  removeToast as removeToastAction,
  initializeInstance as initializeInstanceAction,
} from "../store/toasts"
import { setTimeout, clearTimeout } from "../utils/setTimeout"

export interface ToastProps {
  title: string
  status: AlertStatus
  description?: string
  duration?: number
  isDismissable?: boolean
}
type AlertProps = AlertPropsBase & ToastProps & { onUnmount?: () => void }
type DefaultToastProps = Omit<ToastProps, "title" | "description" | "status">

const Component = (props: AlertProps) => {
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
    <Alert
      as={motion.div}
      initial={{ opacity: 0, x: "-50%", y: "-100%" }}
      animate={{ opacity: 1, x: "-50%", y: 0 }}
      //@ts-ignore - Known issue: https://github.com/chakra-ui/chakra-ui/issues/1814
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
      }}
      position="absolute"
      width={{ base: "100%", md: "75%" }}
      left="50%"
      boxShadow="lg"
      alignItems="baseline"
      {...restProps}
    >
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

function useToast(instanceId: string, defaultToastProps?: DefaultToastProps) {
  const toasts = useSelector((state: RootState) => state.toasts)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeInstanceAction({ instanceId }))
  }, [])

  const addToast = useCallback(
    (props: ToastProps) => {
      dispatch(
        addToastAction({
          instanceId,
          toastData: { ...defaultToastProps, ...props },
        })
      )
    },
    [dispatch, defaultToastProps]
  )

  const removeToast = useCallback(
    (index: number) => {
      dispatch(removeToastAction({ instanceId, index }))
    },
    [dispatch, instanceId]
  )

  const ToastContainer = (props = {}) => (
    <Box {...props} id={`toasts-root-${instanceId}`} position="relative">
      <AnimatePresence>
        {(toasts[instanceId] ?? []).map((toastProps, index) => (
          <Component
            key={`${toastProps.title}-${index}`}
            {...defaultToastProps}
            {...toastProps}
            onUnmount={() => removeToast(index)}
          />
        ))}
      </AnimatePresence>
    </Box>
  )

  return { toast: addToast, ToastContainer }
}

export { useToast }
