import { VStack } from "@threshold-network/components"
import { AnimatePresence } from "framer-motion"
import Toast, { ToastInternalProps, ToastProps } from "./Toast"

type ToastData = ToastProps & Omit<ToastInternalProps, "onUnmount">
export type DefaultToastData = Omit<
  ToastData,
  "id" | "title" | "description" | "status"
>

interface ToastContainerProps {
  id: string
  toasts: ToastData[]
  removeToastFn: (id?: number) => void
  defaultToastData?: DefaultToastData
}

const ToastContainer = (props: ToastContainerProps) => {
  const {
    id,
    toasts,
    defaultToastData = {},
    removeToastFn,
    ...restProps
  } = props
  return (
    <VStack
      {...restProps}
      id={id}
      position="absolute"
      left="50%"
      width="75%"
      transform="translateX(-50%)"
      zIndex="toast"
    >
      <AnimatePresence>
        {(toasts ?? []).map(({ id, ...toastData }) => (
          <Toast
            key={id}
            {...defaultToastData}
            {...toastData}
            onUnmount={() => removeToastFn(id)}
          />
        ))}
      </AnimatePresence>
    </VStack>
  )
}

export const toastContainerFactory = (props: ToastContainerProps) => () =>
  <ToastContainer {...props} />

export default ToastContainer
