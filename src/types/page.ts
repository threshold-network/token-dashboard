import { FC } from "react"

export type RouteProps = {
  path: string
  pathOverride?: string
  title?: string
  index: boolean
  pages?: PageComponent[]
  hideFromMenu?: boolean
  isPageEnabled: boolean
}

export type PageComponent = FC<RouteProps> & { route: RouteProps }
