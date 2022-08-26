import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  BodyMd,
  Box,
  Button,
  Link,
} from "@threshold-network/components"
import { useNavigate } from "react-router-dom"
import { StakeData } from "../../../../types"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"

const StakeApplications: FC<{ stake: StakeData }> = ({ stake }) => {
  const navigate = useNavigate()
  const onAuthorizeClick = () => {
    navigate(`/staking/authorize/${stake.authorizer}`)
  }

  const areNodesMissing = true

  // TODO: This will probably be fetched from contracts
  const appsAuthData = {
    tbtc: {
      label: "tBTC",
      isAuthorized: true,
      percentage: 40,
      isAuthRequired: true,
    },
    randomBeacon: {
      label: "Random Beacon",
      isAuthorized: false,
      percentage: 0,
      isAuthRequired: true,
    },
    pre: {
      label: "PRE",
      isAuthorized: false,
      percentage: 0,
      isAuthRequired: false,
    },
  }

  return (
    <Box>
      <BodyMd>Applications</BodyMd>
      {areNodesMissing && (
        <Alert status="error" my={4} px={2} py={1}>
          <AlertIcon />
          <AlertDescription>
            Missing Nodes.{" "}
            <Link
              // TODO: Do not forget to update this link
              href={"/overview"}
              target="_blank"
              textDecoration={"underline"}
            >
              More info
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <AuthorizeApplicationRow
        mb={"3"}
        onAuthorizeClick={onAuthorizeClick}
        appAuthData={appsAuthData.tbtc}
      />
      <AuthorizeApplicationRow
        onAuthorizeClick={onAuthorizeClick}
        appAuthData={appsAuthData.randomBeacon}
      />
      <Button mt="5" width="100%" onClick={onAuthorizeClick}>
        Configure Apps
      </Button>
    </Box>
  )
}

export default StakeApplications
