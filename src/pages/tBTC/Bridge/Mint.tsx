import { Outlet } from "react-router"
import { PageComponent } from "../../../types"
import { DepositDetails } from "./DepositDetails"
import { MintingCard } from "./MintingCard"

export const MintPage: PageComponent = ({}) => {
  return <Outlet />
}

const DefaultMintPage: PageComponent = () => {
  return <MintingCard gridArea="main-card" p={35} />
}

DefaultMintPage.route = {
  path: "",
  index: false,
  isPageEnabled: true,
}

MintPage.route = {
  path: "mint",
  pathOverride: "mint/*",
  index: true,
  title: "Mint",
  pages: [DefaultMintPage, DepositDetails],
  isPageEnabled: true,
}
