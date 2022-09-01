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
import { StakeData } from "../../../../types"
import AuthorizeApplicationRow from "./AuthorizeApplicationRow"
import { Link as RouterLink } from "react-router-dom"
import { tmpAppAuthData } from "../../tmp"

const StakeApplications: FC<{ stake: StakeData }> = ({ stake }) => {
  const areNodesMissing = true

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
        appAuthData={tmpAppAuthData.tbtc}
        stakingProvider={stake.stakingProvider}
      />
      <AuthorizeApplicationRow
        appAuthData={tmpAppAuthData.randomBeacon}
        stakingProvider={stake.stakingProvider}
      />
      <Button
        mt="5"
        width="100%"
        as={RouterLink}
        to={`/staking/authorize/${stake.stakingProvider}`}
      >
        Configure Apps
      </Button>
    </Box>
  )
}

export default StakeApplications
