import { useSidebar } from "../../hooks/useSidebar"
import { NavItemDetail } from "./NavItem"
import {
  IoBarChart,
  IoBarChartOutline,
  IoHome,
  IoHomeOutline,
  IoSwapHorizontal,
} from "react-icons/all"
import { useLocation } from "react-router-dom"
import { useMemo } from "react"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"

const Sidebar = () => {
  const { pathname } = useLocation()

  const navItems: NavItemDetail[] = useMemo(
    () => [
      {
        text: "Overview",
        icon: pathname === "/" ? IoHome : IoHomeOutline,
        href: "/",
        isActive: pathname === "/",
      },
      {
        text: "Upgrade",
        icon: IoSwapHorizontal,
        href: "/upgrade",
        isActive: pathname === "/upgrade",
      },
      {
        text: "Portfolio",
        icon: pathname === "/portfolio" ? IoBarChart : IoBarChartOutline,
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
