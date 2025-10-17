import { FC } from "react"
import { BodySm, Box, H6, Image } from "@threshold-network/components"
import Link from "../../../../components/Link"
import codeSlashIllustration from "../../../../static/images/code-slash.svg"

export type BridgeProcessResourceProps = {
  title: string
  subtitle: string
  link: string
}

export const BridgeProcessResource: FC<BridgeProcessResourceProps> = ({
  title,
  subtitle,
  link,
}) => {
  return (
    <Box>
      <Box
        bg="yellow.50"
        p="4"
        m="-1rem"
        mr="-1.5rem"
        ml={{ base: "-1.5rem", xl: "-1rem" }}
        mt="auto"
      >
        <Image src={codeSlashIllustration} mx="auto" />
      </Box>
      <H6 mt="8" color="gray.800">
        {title}
      </H6>
      <BodySm mt="1" color="gray.500">
        {subtitle}
      </BodySm>
      <BodySm mb="8">
        <Link isExternal href={link}>
          Read more
        </Link>
      </BodySm>
    </Box>
  )
}
