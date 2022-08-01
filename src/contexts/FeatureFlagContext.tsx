import React, { createContext } from "react"
import { featureFlags, FeatureFlagsType } from "../feature-flags/featureFlags"

export const FeatureFlagsContext = createContext<FeatureFlagsType>(featureFlags)

export const FeatureFlagsContextProvider: React.FC = ({ children }) => {
  return (
    <FeatureFlagsContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}
