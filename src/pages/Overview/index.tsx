import { Container, Image } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import thresholdWordMark from "../../static/images/thresholdWordMark.svg"
import { H1, H3 } from "../../components/Typography"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import useDocumentTitle from "../../hooks/useDocumentTitle"
import Network from "./Network"
import { PageComponent } from "../../types"
import useAddErc20ToMetamask from "../../hooks/useAddErc20ToMetamask"
import { useT } from "../../web3/hooks"

const Overview: PageComponent = () => {
  useDocumentTitle("Threshold - Overview")

  const T = useT()

  const addTToMetamask = useAddErc20ToMetamask(T?.contract)
  const isMobile = useChakraBreakpoint("md")

  return (
    <Container maxW={{ base: "2xl", xl: "6xl" }} my={16}>
      <button onClick={addTToMetamask}>add to metamask</button>
      <Image src={thresholdWordMark} />
      {isMobile ? <H3>Overview</H3> : <H1>Overview</H1>}
      <Outlet />
    </Container>
  )
}

Overview.route = {
  path: "overview",
  index: false,
  pages: [Network],
}

export default Overview
