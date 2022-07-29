import { NavItemDetail } from "./NavItem"
import {
  IoHomeSharp,
  IoLockClosedOutline,
  IoLockClosedSharp,
  IoSwapHorizontalSharp,
} from "react-icons/all"
import { useLocation } from "react-router-dom"
import { useMemo } from "react"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
import { IoHomeOutlineSharp } from "../../static/icons/IoHomeOutlineSharp"
import useUpgradeHref from "../../hooks/useUpgradeHref"

const Sidebar = () => {
  const { pathname } = useLocation()

  const upgradeHref = useUpgradeHref()

  const navItems: NavItemDetail[] = useMemo(
    () => [
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
        activeIcon: IoLockClosedSharp,
        passiveIcon: IoLockClosedOutline,
        href: "/staking",
      },
    ],
    [pathname, upgradeHref]
  )

  return (
    <>
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar navItems={navItems} />
    </>
  )
}

export default Sidebar
