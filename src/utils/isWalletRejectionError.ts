export const isWalletRejectionError = (error: Error): boolean => {
  const { message } = error
  if (message === "MetaMask Tx Signature: User denied transaction signature.") {
    return true
  }
  return false
}
