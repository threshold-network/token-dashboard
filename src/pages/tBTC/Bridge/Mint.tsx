import { Outlet } from "react-router"
import { MintingCard } from "./MintingCard"
import { PageComponent } from "../../../types"

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
  index: true,
  title: "Mint",
  pages: [DefaultMintPage],
  isPageEnabled: true,
}
