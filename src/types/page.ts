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

export type PageComponent = FC<
  RouteProps & {
    // Paths combined from all Route parents of the current Route
    parentPathBase: string
  }
> & {
  route: RouteProps
}
