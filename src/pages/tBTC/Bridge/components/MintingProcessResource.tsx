import { FC } from "react"
import { BodySm, Box, H6, Image } from "@threshold-network/components"
import Link from "../../../../components/Link"
import codeSlashIllustration from "../../../../static/images/code-slash.svg"

export type MintingProcessResourceProps = {
  title: string
  subtitle: string
  link: string
}

export const MintingProcessResource: FC<MintingProcessResourceProps> = ({
  title,
  subtitle,
  link,
}) => {
  return (
    <>
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
      <BodySm mt="1" color="gray.500" mb="8">
        {subtitle}{" "}
        <Link isExternal href={link}>
          Read more
        </Link>
      </BodySm>
    </>
  )
}
