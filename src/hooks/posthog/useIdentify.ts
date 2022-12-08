import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { ConnectorEvent, ConnectorUpdate } from "@web3-react/types"
import * as posthog from "../../posthog"
import { getAddress, isSameETHAddress } from "../../web3/utils"
import { featureFlags } from "../../constants"
import { hashString } from "../../utils/crypto"
import { useAnalytics } from "../useAnalytics"

export const useIdentify = () => {
  const { isAnalyticsEnabled } = useAnalytics()
  const { connector, account } = useWeb3React()

  useEffect(() => {
    if (!featureFlags.POSTHOG) return
    if (!isAnalyticsEnabled) return

    const onLogin = async () => {
      const account = await connector?.getAccount()

      if (account) {
        const hashedAccount = await hashString({
          value: getAddress(account).toUpperCase(),
        })

        posthog.identify(hashedAccount)
      }
    }
    onLogin()
  }, [connector, isAnalyticsEnabled])

  useEffect(() => {
    if (!featureFlags.POSTHOG) return
    if (!isAnalyticsEnabled) return

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
  }, [connector, account, isAnalyticsEnabled])
}
