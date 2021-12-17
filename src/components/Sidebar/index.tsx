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

  const navItems: NavItemDetail[] = useMemo(
    () => [
      {
        text: "Overview",
        icon: useRouteMatch("/overview") ? IoHomeSharp : IoHomeOutlineSharp,
        href: "/",
        isActive: useRouteMatch("/overview"),
      },
      {
        text: "Upgrade",
        icon: IoSwapHorizontalSharp,
        href: "/upgrade",
        isActive: useRouteMatch("/upgrade"),
      },
      {
        text: "Portfolio",
        icon: useRouteMatch("/portfolio")
          ? IoBarChartSharp
          : IoChartOutlineSharp,
        href: "/portfolio",
        isActive: useRouteMatch("/portfolio"),
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
