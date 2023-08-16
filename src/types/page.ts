import { FC } from "react"

export type RouteProps = {
  path: string
  pathOverride?: string
  title?: string
  index: boolean
  pages?: PageComponent[]
  hideFromMenu?: boolean
  isPageEnabled: boolean
  // Paths combined from all Route parents of the current Route
  parentPathBase?: string
}

export type PageComponent = FC<RouteProps> & {
  route: RouteProps
}
