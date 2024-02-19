import { useEffect } from "react"
import { featureFlags } from "../../constants"
import { EnvVariable } from "../../enums"
import { getEnvVariable } from "../../utils/getEnvVariable"

export const useGoogleTagManager = () => {
  useEffect(() => {
    // TODO: Use proper google tag manager id from env
    const gtmId = getEnvVariable(EnvVariable.GOOGLE_TAG_MANAGER_ID)

    if (featureFlags.GOOGLE_TAG_MANAGER && gtmId) {
      const script = document.createElement("script")
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `
      document.head.appendChild(script)

      // Add noscript iframe for environments where JavaScript is disabled
      const noscript = document.createElement("noscript")
      const iframe = document.createElement("iframe")
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`
      iframe.height = "0"
      iframe.width = "0"
      iframe.style.display = "none"
      iframe.style.visibility = "hidden"
      noscript.appendChild(iframe)
      document.body.appendChild(noscript)
    }
  }, [])
}
