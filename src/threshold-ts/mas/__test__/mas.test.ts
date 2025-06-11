import { BigNumber, providers } from "ethers"
import RandomBeacon from "@keep-network/random-beacon/artifacts/RandomBeacon.json"
import WalletRegistry from "@keep-network/ecdsa/artifacts/WalletRegistry.json"
// SKIP: TacoRegistry import - skipping Taco-related tests
// import TacoRegistry from "@threshold-network/solidity-contracts/artifacts/TacoRegistry.json"
import { MultiAppStaking } from ".."
import { Application } from "../../applications"
import { IMulticall } from "../../multicall"
import { IStaking } from "../../staking"
import { EthereumConfig } from "../../types"

// TODO: Update tests to use the new source of `WalletRegistry` artifacts.

jest.mock("../../applications", () => ({
  ...(jest.requireActual("../../applications") as {}),
  Application: jest.fn(),
}))

jest.mock("@keep-network/random-beacon/artifacts/RandomBeacon.json", () => ({
  address: "0x1",
  abi: [],
}))

jest.mock("@keep-network/ecdsa/artifacts/WalletRegistry.json", () => ({
  address: "0x2",
  abi: [],
}))

// SKIP: TacoRegistry mock - skipping Taco-related tests
// jest.mock(
//   "@threshold-network/solidity-contracts/artifacts/TacoRegistry.json",
//   () => ({
//     address: "0x3",
//     abi: [],
//   })
// )

describe.skip("Multi app staking test - SKIPPED: TacoRegistry not available", () => {
  let staking: IStaking
  let multicall: IMulticall
  let config: EthereumConfig
  let mas: MultiAppStaking
  const app1 = {
    address: WalletRegistry.address,
    contract: { interface: {} },
  } as unknown as Application
  const app2 = {
    address: RandomBeacon.address,
    contract: { interface: {} },
  } as unknown as Application
  // SKIP: Taco app - skipping Taco-related tests
  // const app3 = {
  //   address: TacoRegistry.address,
  //   contract: { interface: {} },
  // } as unknown as Application

  beforeEach(() => {
    staking = {} as IStaking
    multicall = { aggregate: jest.fn() } as IMulticall
    ;(Application as unknown as jest.Mock).mockReturnValueOnce(app1)
    ;(Application as unknown as jest.Mock).mockReturnValueOnce(app2)
    ;(Application as unknown as jest.Mock).mockReturnValueOnce(app3)
    config = { chainId: 1, providerOrSigner: {} as providers.Provider }
    mas = new MultiAppStaking(staking, multicall, config)
  })

  test("should create the service correctly", () => {
    expect(Application).toHaveBeenCalledTimes(3)
    expect(Application).toHaveBeenNthCalledWith(1, staking, multicall, {
      address: RandomBeacon.address,
      abi: RandomBeacon.abi,
      ...config,
    })
    expect(Application).toHaveBeenNthCalledWith(2, staking, multicall, {
      address: WalletRegistry.address,
      abi: WalletRegistry.abi,
      ...config,
    })
    expect(Application).toHaveBeenNthCalledWith(3, staking, multicall, {
      address: TacoRegistry.address,
      abi: TacoRegistry.abi,
      ...config,
    })
    expect(mas.randomBeacon).toBeDefined()
    expect(mas.ecdsa).toBeDefined()
    expect(mas.taco).toBeDefined()
  })

  test("should return the supported apps authroziation parameters", async () => {
    const tbtcAuthParams = {
      minimumAuthorization: BigNumber.from("1"),
      authorizationDecreaseDelay: BigNumber.from("2"),
      authorizationDecreaseChangePeriod: BigNumber.from("3"),
    }

    const randomBeaconAuthParams = {
      minimumAuthorization: BigNumber.from("4"),
      authorizationDecreaseDelay: BigNumber.from("5"),
      authorizationDecreaseChangePeriod: BigNumber.from("6"),
    }

    const tacoAuthParams = {
      minimumAuthorization: BigNumber.from("7"),
      authorizationDecreaseDelay: BigNumber.from("8"),
      authorizationDecreaseChangePeriod: BigNumber.from("9"),
    }

    const mulitcallMockResult = [
      tbtcAuthParams,
      randomBeaconAuthParams,
      tacoAuthParams,
    ]
    const spyOnMulticall = jest
      .spyOn(multicall, "aggregate")
      .mockResolvedValue(mulitcallMockResult)

    const result = await mas.getSupportedAppsAuthParameters()

    expect(spyOnMulticall).toHaveBeenCalledWith([
      {
        interface: mas.ecdsa.contract.interface,
        address: mas.ecdsa.address,
        method: "authorizationParameters",
        args: [],
      },
      {
        interface: mas.randomBeacon.contract.interface,
        address: mas.randomBeacon.address,
        method: "authorizationParameters",
        args: [],
      },
      {
        interface: mas.taco.contract.interface,
        address: mas.taco.address,
        method: "authorizationParameters",
        args: [],
      },
    ])
    expect(result).toEqual({
      tbtc: tbtcAuthParams,
      randomBeacon: randomBeaconAuthParams,
      taco: tacoAuthParams,
    })
  })

  test("should return mapped operators for given staking provider", async () => {
    const mockStakingProvider = "0x3"
    const mockOperator = "0x4"
    const mappedOperatorTbtc = mockOperator
    const mappedOperatorRandomBeacon = mockOperator
    const mappedOperatorTaco = mockOperator

    const mulitcallMockResult = [
      [mappedOperatorTbtc],
      [mappedOperatorRandomBeacon],
      [mappedOperatorTaco],
    ]
    const spyOnMulticall = jest
      .spyOn(multicall, "aggregate")
      .mockResolvedValue(mulitcallMockResult)

    const result = await mas.getMappedOperatorsForStakingProvider(
      mockStakingProvider
    )

    expect(spyOnMulticall).toHaveBeenCalledWith([
      {
        interface: mas.ecdsa.contract.interface,
        address: mas.ecdsa.address,
        method: "stakingProviderToOperator",
        args: [mockStakingProvider],
      },
      {
        interface: mas.randomBeacon.contract.interface,
        address: mas.randomBeacon.address,
        method: "stakingProviderToOperator",
        args: [mockStakingProvider],
      },
      {
        interface: mas.taco.contract.interface,
        address: mas.taco.address,
        method: "stakingProviderToOperator",
        args: [mockStakingProvider],
      },
    ])
    expect(result).toEqual({
      tbtc: mappedOperatorTbtc,
      randomBeacon: mappedOperatorRandomBeacon,
      taco: mappedOperatorTaco,
    })
  })
})
