import { FC } from "react"

export type RouteProps = {
  path: string
  title?: string
  index: boolean
  pages?: PageComponent[]
  isPageEnabled: boolean
}

export type PageComponent = FC<RouteProps> & { route: RouteProps }
