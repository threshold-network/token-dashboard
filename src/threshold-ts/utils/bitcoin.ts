import { Network, validate } from "bitcoin-address-validation"

export const isValidBtcAddress = (
  address: string,
  network: Network = Network.mainnet
): boolean => {
  return validate(address, network)
}
