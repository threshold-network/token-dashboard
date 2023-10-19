import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  VStack,
  AlertProps as AlertPropsBase,
  AlertStatus,
  CloseButton,
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
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: 0 }}
      //@ts-ignore - Known issue: https://github.com/chakra-ui/chakra-ui/issues/1814
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
      }}
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
      const id = Date.now()

      dispatch(
        addToastAction({
          instanceId,
          toastData: { id, ...defaultToastProps, ...props },
        })
      )
      return { id, removeToast: () => removeToast(id) }
    },
    [dispatch, defaultToastProps]
  )

  const removeToast = useCallback(
    (id?: number) => {
      dispatch(removeToastAction({ instanceId, id }))
    },
    [dispatch, instanceId]
  )

  const ToastContainer = (props = {}) => (
    <VStack
      {...props}
      id={`toasts-root-${instanceId}`}
      position="absolute"
      left="50%"
      width="75%"
      transform="translateX(-50%)"
      zIndex="toast"
    >
      <AnimatePresence>
        {(toasts[instanceId] ?? []).map(({ id, ...toastProps }) => (
          <Component
            key={id}
            {...defaultToastProps}
            {...toastProps}
            onUnmount={() => removeToast(id)}
          />
        ))}
      </AnimatePresence>
    </VStack>
  )

  return { addToast, ToastContainer, removeToast }
}

export { useToast }
