import { useEffect } from "react"
import * as posthog from "../../posthog"
import { getAddress } from "../../web3/utils"
import { featureFlags } from "../../constants"
import { getWalletTypeFromConnector } from "../../web3/utils/connectors"
import { useIsActive } from "../useIsActive"

export const useIdentify = () => {
  const { connector } = useIsActive()

  useEffect(() => {
    if (!featureFlags.POSTHOG) return

    const onAccountChange = async () => {
      const account = await connector?.getAccount()

      if (account) {
        const walletType = getWalletTypeFromConnector(connector)

        posthog.identify(getAddress(account), {
          address: getAddress(account),
          walletType,
        })
      } else {
        posthog.reset()
      }
    }
    onAccountChange()
  }, [connector])

  /**
   * Commenting out the useEffect below because we currently refresh the page
   * when the account is changed. Therefore, resetting PostHog after an account
   * change is unnecessary.
   */

  // useEffect(() => {
  //   if (!featureFlags.POSTHOG) return

  //   const updateHandler = async (update: ConnectorUpdate) => {
  //     console.log("update handlerrr!!")
  //     if (!update.account) {
  //       posthog.reset()
  //     } else if (
  //       update.account &&
  //       account &&
  //       !isSameAddress(update.account, account)
  //     ) {
  //       posthog.reset()

  //       const hashedAccount = await hashString({
  //         value: getAddress(account).toUpperCase(),
  //       })
  //       console.log("hashed account2: ", hashedAccount)
  //       posthog.identify(hashedAccount, {
  //         address: getAddress(account),
  //       })
  //       console.log("posthog identified again!")
  //     }
  //   }

  //   const deactivateHandler = () => {
  //     console.log("deactiateeee!!!")
  //     posthog.reset()
  //   }

  //   connector?.on(ConnectorEvent.Update, updateHandler)
  //   connector?.on(ConnectorEvent.Deactivate, deactivateHandler)
  //   return () => {
  //     connector?.removeListener(ConnectorEvent.Update, updateHandler)
  //     connector?.removeListener(ConnectorEvent.Deactivate, deactivateHandler)
  //   }
  // }, [connector, account])
}
