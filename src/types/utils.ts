import { ReactElement } from "react"

export interface IconMap {
  [key: string]: ReactElement
}

export enum ChainID {
  Ethereum = 1,
  Ropsten = 3,
}
