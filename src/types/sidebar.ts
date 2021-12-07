export interface OpenSidebar {}
export interface CloseSidebar {}

export type SidebarActionTypes = OpenSidebar | CloseSidebar

export interface UseSidebar {
  (): {
    isOpen: boolean
    openSidebar: () => SidebarActionTypes
    closeSidebar: () => SidebarActionTypes
  }
}
