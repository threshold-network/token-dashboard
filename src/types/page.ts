import { FC } from "react"

export type RouteProps = {
  path: string
  title?: string
  index: boolean
  pages?: PageComponent[]
}

export type PageComponent = FC<RouteProps> & { route: RouteProps }
