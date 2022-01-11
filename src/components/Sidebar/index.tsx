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

const Sidebar = () => {
  const { pathname } = useLocation()

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
        href: "/upgrade",
      },
      {
        text: "StakingSuccessModal",
        activeIcon: IoBarChartSharp,
        passiveIcon: IoChartOutlineSharp,
        href: "/staking",
      },
    ],
    [pathname]
  )

  return (
    <>
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar navItems={navItems} />
    </>
  )
}

export default Sidebar
