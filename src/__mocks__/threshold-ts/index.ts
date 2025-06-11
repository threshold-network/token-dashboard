export class TBTC {
  getEstimatedDepositFees = jest.fn()
  revealDeposit = jest.fn()
  bridgeContract = true
}

export class Threshold {
  tbtc: TBTC

  constructor() {
    this.tbtc = new TBTC()
  }
}
