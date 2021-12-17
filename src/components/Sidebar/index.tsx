import { NavItemDetail } from "./NavItem"
import {
  IoBarChartSharp,
  IoBarChartOutline,
  IoHomeSharp,
  IoHomeOutline,
  IoSwapHorizontalSharp,
} from "react-icons/all"
import { useLocation, useRouteMatch } from "react-router-dom"
import { useMemo } from "react"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
import { IoHomeOutlineSharp } from "../../static/icons/IoHomeOutlineSharp"
import { IoChartOutlineSharp } from "../../static/icons/IoChartOutlineSharp"

const Sidebar = () => {
  const { pathname } = useLocation()

  const isOverview = useRouteMatch("/overview")
  const isUpgrade = useRouteMatch("/upgrade")
  const isPortfolio = useRouteMatch("/portfolio")

  const navItems: NavItemDetail[] = useMemo(
    () => [
      {
        text: "Overview",
        icon: isOverview ? IoHomeSharp : IoHomeOutlineSharp,
        href: "/",
        isActive: isOverview,
      },
      {
        text: "Upgrade",
        icon: IoSwapHorizontalSharp,
        href: "/upgrade",
        isActive: isUpgrade,
      },
      {
        text: "Portfolio",
        icon: isPortfolio ? IoBarChartSharp : IoChartOutlineSharp,
        href: "/portfolio",
        isActive: isPortfolio,
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
