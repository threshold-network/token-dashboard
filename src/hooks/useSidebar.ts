import { useDispatch, useSelector } from "react-redux"
import { UseSidebar } from "../types"
import {
  closeSidebar as closeSidebarAction,
  openSidebar as openSidebarAction,
} from "../store/sidebar"
import { RootState } from "../store"

export const useSidebar: UseSidebar = () => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen)
  const dispatch = useDispatch()

  const openSidebar = () => dispatch(openSidebarAction())
  const closeSidebar = () => dispatch(closeSidebarAction())

  return {
    isOpen,
    openSidebar,
    closeSidebar,
  }
}
