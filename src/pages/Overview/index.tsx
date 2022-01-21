import { useEffect } from "react"
import { Container, Image } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import thresholdWordMark from "../../static/images/thresholdWordMark.svg"
import { H1, H3 } from "../../components/Typography"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"
import { useFetchTvl } from "../../hooks/useFetchTvl"

const Overview = ({}) => {
  const isMobile = useChakraBreakpoint("md")
  const [data, fetchtTvlData] = useFetchTvl()

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])

  return (
    <Container maxW={{ base: "2xl", xl: "6xl" }} my={16}>
      <Image src={thresholdWordMark} />
      {isMobile ? <H3>Overview</H3> : <H1>Overview</H1>}
      <Outlet />
    </Container>
  )
}

export default Overview
