import { VStack } from "@threshold-network/components"
import { AnimatePresence } from "framer-motion"
import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import {
  addToast as addToastAction,
  removeToast as removeToastAction,
  initializeInstance as initializeInstanceAction,
} from "../store/toasts"
import { ToastProps } from "../components/Toast/Toast"
import {
  DefaultToastData,
  toastContainerFactory,
} from "../components/Toast/ToastContainer"

function useToast(instanceId: string, defaultToastData?: DefaultToastData) {
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
          toastData: { id, ...defaultToastData, ...props },
        })
      )
      return { id, removeToast: () => removeToast(id) }
    },
    [dispatch, defaultToastData]
  )

  const removeToast = useCallback(
    (id?: number) => {
      dispatch(removeToastAction({ instanceId, id }))
    },
    [dispatch, instanceId]
  )

  const ToastContainer = toastContainerFactory({
    id: instanceId,
    toasts: toasts[instanceId],
    defaultToastData,
    removeToastFn: removeToast,
  })

  return { addToast, ToastContainer, removeToast }
}

export { useToast }
