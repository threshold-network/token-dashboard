import React from "react"
import authorizeAppsFingerPrint from "../../static/images/AuthorizeAppsFingerPrint.png"
import AnnouncementBanner from "../../components/AnnouncementBanner"

export const AuthorizeApplicationsBanner = () => {
  return (
    <AnnouncementBanner
      imgSrc={authorizeAppsFingerPrint}
      title="Authorize Threshold apps and stake your T to earn rewards."
      href="/staking"
      buttonText="Start Staking"
    />
  )
}
