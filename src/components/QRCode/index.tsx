import { HTMLChakraProps } from "@chakra-ui/react"
import React, { FC } from "react"
import ReactQRCode, { QRCodeProps } from "react-qr-code"

export interface QrCodeWrapperProps extends Omit<QRCodeProps, "ref"> {}

export const QRCode: FC<QrCodeWrapperProps> = (props) => {
  return <ReactQRCode {...props} />
}
