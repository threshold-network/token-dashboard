import { FC } from "react"
import { BodyLg } from "@threshold-network/components"
import ButtonLink from "../../ButtonLink"

export const DeauthorizeInfo: FC<{ stakingProvider: string }> = ({
  stakingProvider,
}) => {
  return (
    <>
      <BodyLg mt="6">
        Make sure you deauthorized all the applications using your stake funds.
      </BodyLg>

      <ButtonLink
        size="sm"
        variant="outline"
        to={`/staking/${stakingProvider}/authorize`}
        alignSelf="flex-end"
        mt="5"
      >
        Deauthorize Applications
      </ButtonLink>
    </>
  )
}
