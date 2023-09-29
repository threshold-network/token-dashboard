import {
  IoHomeSharp,
  // IoLockClosedOutline,
  // IoLockClosedSharp,
  // IoSwapHorizontalSharp,
  // IoChatbubbleEllipsesOutline,
  // IoChatbubbleEllipsesSharp,
} from "react-icons/all"
import DesktopSidebar from "./DesktopSidebar"
import MobileSidebar from "./MobileSidebar"
import { IoHomeOutlineSharp } from "../../static/icons/IoHomeOutlineSharp"
// import { tBTCFill } from "../../static/icons/tBTCFill"
// import { tBTCOutline } from "../../static/icons/tBTCOutline"
import { pages } from "../../pages"

const sidebarItems = pages
  .filter((page) => page.route.isPageEnabled)
  .map((page) => ({
    text: page.route.title!,
    // TODO: set correct icons for a given page.
    activeIcon: IoHomeSharp,
    passiveIcon: IoHomeOutlineSharp,
    href: `/${page.route.path}`,
  }))

const Sidebar = () => {
  return (
    <>
      <DesktopSidebar navItems={sidebarItems} />
      <MobileSidebar navItems={sidebarItems} />
    </>
  )
}

export default Sidebar
