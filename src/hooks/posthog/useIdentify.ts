import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { ConnectorEvent, ConnectorUpdate } from "@web3-react/types"
import * as posthog from "../../posthog"
import { getAddress, isSameETHAddress } from "../../web3/utils"
import { featureFlags } from "../../constants"
import { useAppSelector } from "../store"
import hashString from "../../utils/hashString"

export const useIdentify = () => {
  const { connector, account } = useWeb3React()
  const shouldEnableAnalytics = useAppSelector(
    (state) => state.analytics.shouldEnableAnalytics
  )

  useEffect(() => {
    if (!featureFlags.POSTHOG) return
    if (!shouldEnableAnalytics) return

    const onLogin = async () => {
      const account = await connector?.getAccount()

      if (account) {
        const hashedAccount = await hashString({
          string: getAddress(account).toUpperCase(),
        })

        posthog.identify(hashedAccount)
      }
    }
    onLogin()
  }, [connector, shouldEnableAnalytics])

  useEffect(() => {
    if (!featureFlags.POSTHOG) return
    if (!shouldEnableAnalytics) return

    const updateHandler = (update: ConnectorUpdate) => {
      if (!update.account) {
        posthog.reset()
      } else if (
        update.account &&
        account &&
        !isSameETHAddress(update.account, account)
      ) {
        posthog.reset()
        posthog.identify(getAddress(update.account))
      }
    }

    const deactivateHandler = () => {
      posthog.reset()
    }

    connector?.on(ConnectorEvent.Update, updateHandler)
    connector?.on(ConnectorEvent.Deactivate, deactivateHandler)
    return () => {
      connector?.removeListener(ConnectorEvent.Update, updateHandler)
      connector?.removeListener(ConnectorEvent.Deactivate, deactivateHandler)
    }
  }, [connector, account, shouldEnableAnalytics])
}
