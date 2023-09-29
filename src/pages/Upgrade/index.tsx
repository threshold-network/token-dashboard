import UpgradeKEEP from "./UpgradeKEEP"
import UpgradeNU from "./UpgradeNU"
import PageLayout from "../PageLayout"
import { PageComponent } from "../../types"
import { featureFlags } from "../../constants"
import useUpgradeHref from "../../hooks/useUpgradeHref"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const UpgradePage: PageComponent = (props) => {
  const upgradeHref = useUpgradeHref()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(upgradeHref)
  }, [upgradeHref, navigate])

  return <PageLayout title={props.title} pages={props.pages} />
}

UpgradePage.route = {
  path: "upgrade",
  index: true,
  pages: [UpgradeKEEP, UpgradeNU],
  title: "Upgrade",
  isPageEnabled: !featureFlags.BUILD_TBTC_V2_ONLY,
}

export default UpgradePage
