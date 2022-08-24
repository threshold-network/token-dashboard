import { NavItemDetail } from "./NavItem"
import {
  IoBarChartSharp,
  IoHomeSharp,
  IoSwapHorizontalSharp,
} from "react-icons/all"
import { useLocation } from "react-router-dom"
import { useMemo } from "react"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
import { IoHomeOutlineSharp } from "../../static/icons/IoHomeOutlineSharp"
import { IoChartOutlineSharp } from "../../static/icons/IoChartOutlineSharp"
import useUpgradeHref from "../../hooks/useUpgradeHref"
import { tBTCFill } from "../../static/icons/tBTCFill"
import { tBTCOutline } from "../../static/icons/tBTCOutline"
import { featureFlags } from "../../constants"

const Sidebar = () => {
  const { pathname } = useLocation()

  const upgradeHref = useUpgradeHref()

  const navItems: NavItemDetail[] = useMemo(() => {
    const navItems = [
      {
        text: "Overview",
        activeIcon: IoHomeSharp,
        passiveIcon: IoHomeOutlineSharp,
        href: "/overview",
      },
      {
        text: "Upgrade",
        activeIcon: IoSwapHorizontalSharp,
        passiveIcon: IoSwapHorizontalSharp,
        href: upgradeHref,
      },
      {
        text: "Staking",
        activeIcon: IoBarChartSharp,
        passiveIcon: IoChartOutlineSharp,
        href: "/staking",
      },
    ]

    if (featureFlags.TBTC_V2) {
      navItems.push({
        text: "tBTC",
        activeIcon: tBTCFill,
        passiveIcon: tBTCOutline,
        href: "/tBTC",
      } as NavItemDetail)
    }

    return navItems
  }, [pathname, upgradeHref])

  return (
    <>
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar navItems={navItems} />
    </>
  )
}

export default Sidebar
