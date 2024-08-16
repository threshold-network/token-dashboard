import { FC } from "react"
import { LinkProps } from "@threshold-network/components"

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

export type ExternalLinkProps = LinkProps & {
  title: string
}
