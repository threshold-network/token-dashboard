export interface TmpAppAuthData {
  label: string
  isAuthorized: boolean
  appName: string
  percentage: number
  isAuthRequired: boolean
  min: string
  max: string
}

// TODO: This will probably be fetched from contracts
export const tmpAppAuthData: { [app: string]: TmpAppAuthData } = {
  tbtc: {
    label: "tBTC",
    appName: "tbtc",
    isAuthorized: true,
    percentage: 40,
    isAuthRequired: true,
    min: "1",
    max: "5",
  },
  randomBeacon: {
    label: "Random Beacon",
    appName: "randomBeacon",
    isAuthorized: false,
    percentage: 0,
    isAuthRequired: true,
    min: "1",
    max: "5",
  },
  pre: {
    label: "PRE",
    appName: "pre",
    isAuthorized: false,
    percentage: 0,
    isAuthRequired: false,
    min: "1",
    max: "5",
  },
}
