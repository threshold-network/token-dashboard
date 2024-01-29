import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useIsEmbed } from "./useIsEmbed"

/**
 * Detects if application is Embed based on the `?embed=true` query parameter.
 * Based on that it will save that information in local storage (under `isEmbed`
 * property).
 *
 * Besides that it will also set `?embed=true` query parameter for every url if
 * the `isEmbed` property is set to true in local storage. This will persist the
 * embed flag when the user refreshed the page unless he removes the
 * `?embed=true` query parameter from url.
 */
export const useDetectIfEmbed = () => {
  const { enableIsEmbed, isEmbed, disableIsEmbed } = useIsEmbed()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = new URLSearchParams(window.location.search)
  const [isEmbedChecked, setIsEmbedChecked] = useState(false)

  /**
   * Enables embed mode if the `?embed=true` query parameter is in the url.
   */
  useEffect(() => {
    if (params.get("embed") && params.get("embed") === "true") {
      enableIsEmbed()
    } else {
      disableIsEmbed()
    }
    setIsEmbedChecked(true)
  }, [])

  /**
   * Adds query parameter to the current url if `isEmbed` flag is set to true in
   * local storage. It fires every time the url changes.
   */
  useEffect(() => {
    if (!isEmbedChecked) return
    if (isEmbed) {
      setSearchParams({ embed: "true" })
    }
  }, [location.pathname, isEmbed, isEmbedChecked])
}
