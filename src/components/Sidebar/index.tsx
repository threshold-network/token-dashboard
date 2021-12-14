import { NavItemDetail } from "./NavItem"
import {
  IoBarChartSharp,
  IoBarChartOutline,
  IoHomeSharp,
  IoHomeOutline,
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
        icon: pathname === "/" ? IoHomeSharp : IoHomeOutlineSharp,
        href: "/",
        isActive: pathname === "/",
      },
      {
        text: "Upgrade",
        icon: IoSwapHorizontalSharp,
        href: "/upgrade",
        isActive: pathname === "/upgrade",
      },
      {
        text: "Portfolio",
        icon: pathname === "/portfolio" ? IoBarChartSharp : IoChartOutlineSharp,
        href: "/portfolio",
        isActive: pathname === "/portfolio",
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
