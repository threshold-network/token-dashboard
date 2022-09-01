export interface TmpAppAuthData {
  label: string
  isAuthorized: boolean
  percentage: number
  isAuthRequired: boolean
  min: string
  max: string
}

// TODO: This will probably be fetched from contracts
export const tmpAppAuthData: { [app: string]: TmpAppAuthData } = {
  tbtc: {
    label: "tBTC",
    isAuthorized: true,
    percentage: 40,
    isAuthRequired: true,
    min: "1",
    max: "5",
  },
  randomBeacon: {
    label: "Random Beacon",
    isAuthorized: false,
    percentage: 0,
    isAuthRequired: true,
    min: "1",
    max: "5",
  },
  pre: {
    label: "PRE",
    isAuthorized: false,
    percentage: 0,
    isAuthRequired: false,
    min: "1",
    max: "5",
  },
}
