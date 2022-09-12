import { renderHook } from "@testing-library/react-hooks"
import * as ethersUnits from "@ethersproject/units"
import { Token } from "../../enums"
import {
  useKeepAssetPoolContract,
  useKeepBondingContract,
  useKeepTokenStakingContract,
  useMulticall,
  useMulticallContract,
  useTStakingContract,
} from "../../web3/hooks"
import { useETHData } from "../useETHData"
import { useFetchTvl } from "../useFetchTvl"
import * as useTokenModule from "../useToken"
import { TokenContext } from "../../contexts/TokenContext"
import * as usdUtils from "../../utils/getUsdBalance"

jest.mock("../../web3/hooks", () => ({
  ...(jest.requireActual("../../web3/hooks") as {}),
  useKeepAssetPoolContract: jest.fn(),
  useKeepBondingContract: jest.fn(),
  useKeepTokenStakingContract: jest.fn(),
  useMulticall: jest.fn(),
  useMulticallContract: jest.fn(),
  useTStakingContract: jest.fn(),
}))

jest.mock("../useETHData", () => ({
  ...(jest.requireActual("../useETHData") as {}),
  useETHData: jest.fn(),
}))

describe("Test `useFetchTvl` hook", () => {
  const keepContext = {
    contract: {} as any,
    usdConversion: 1,
  } as any
  const tbtcContext = {
    contract: {} as any,
    usdConversion: 2,
  } as any

  const tContext = {
    contract: {} as any,
    usdConversion: 3,
  } as any

  const nuContext = {
    contract: {} as any,
    usdConversion: 4,
  } as any

  const mockedKeepTokenStakingContract = { address: "0x1" }
  const mockedKeepBondingContract = { address: "0x0" }
  const mockedTStakingContract = { address: "0x2" }
  const mockedMultiCallContract = { interface: {}, address: "0x3" }
  const mockedKeepAssetPoolContract = { interface: {}, address: "0x4" }

  const wrapper = ({ children }) => (
    <TokenContext.Provider
      value={{
        [Token.Keep]: keepContext,
        [Token.TBTC]: tbtcContext,
        [Token.T]: tContext,
        [Token.Nu]: nuContext,
      }}
    >
      {children}
    </TokenContext.Provider>
  )

  const multicallRequest = jest.fn()
  const mockedETHData = { usdPrice: 20 }

  beforeEach(() => {
    ;(useMulticall as jest.Mock).mockReturnValue(multicallRequest)
    ;(useETHData as jest.Mock).mockReturnValue(mockedETHData)
    ;(useKeepBondingContract as jest.Mock).mockReturnValue(
      mockedKeepBondingContract
    )
    ;(useMulticallContract as jest.Mock).mockReturnValue(
      mockedMultiCallContract
    )
    ;(useKeepAssetPoolContract as jest.Mock).mockReturnValue(
      mockedKeepAssetPoolContract
    )
    ;(useTStakingContract as jest.Mock).mockReturnValue(mockedTStakingContract)
    ;(useKeepTokenStakingContract as jest.Mock).mockReturnValue(
      mockedKeepTokenStakingContract
    )
  })

  test("should fetch tvl data correctly.", async () => {
    // given
    const ethInKeepBonding = { raw: "10000000000000000000", format: "10.0" }
    const tbtcTokenTotalSupply = { raw: "5000000000000000000", format: "5.0" }
    const coveragePoolTvl = { raw: "300000000000000000000", format: "300.0" }
    const keepStaking = { raw: "500000000000000000000", format: "500.0" }
    const tStaking = { raw: "600000000000000000000", format: "600.0" }

    const multicallRequestResult = [
      ethInKeepBonding.raw,
      tbtcTokenTotalSupply.raw,
      coveragePoolTvl.raw,
      keepStaking.raw,
      tStaking.raw,
    ]

    multicallRequest.mockResolvedValue(multicallRequestResult)

    const spyOnFormatUnits = jest.spyOn(ethersUnits, "formatUnits")
    const spyOnToUsdBalance = jest.spyOn(usdUtils, "toUsdBalance")
    const spyOnUseToken = jest.spyOn(useTokenModule, "useToken")

    const _expectedResult = {
      ecdsa: ethInKeepBonding.format * mockedETHData.usdPrice,
      tbtc: tbtcTokenTotalSupply.format * tbtcContext.usdConversion,
      keepCoveragePool: coveragePoolTvl.format * keepContext.usdConversion,
      keepStaking: keepStaking.format * keepContext.usdConversion,
      tStaking: tStaking.format * tContext.usdConversion,
    }

    // `FixedNumber` from `@ethersproject/bignumber` adds trailing zero so we
    // need to do the same here.
    const expectedResult = {
      ecdsa: `${_expectedResult.ecdsa.toString()}.0`,
      tbtc: `${_expectedResult.tbtc.toString()}.0`,
      keepCoveragePool: `${_expectedResult.keepCoveragePool.toString()}.0`,
      keepStaking: `${_expectedResult.keepStaking.toString()}.0`,
      tStaking: `${_expectedResult.tStaking.toString()}.0`,
      total: `${
        _expectedResult.ecdsa +
        _expectedResult.tbtc +
        _expectedResult.keepCoveragePool +
        _expectedResult.keepStaking +
        _expectedResult.tStaking
      }.0`,
    }

    // when
    const { result, waitForNextUpdate } = renderHook(() => useFetchTvl(), {
      wrapper,
    })

    // then
    expect(useETHData).toHaveBeenCalled()
    expect(spyOnUseToken).toHaveBeenCalledWith(Token.Keep)
    expect(spyOnUseToken).toHaveBeenCalledWith(Token.TBTC)
    expect(spyOnUseToken).toHaveBeenCalledWith(Token.T)
    expect(useKeepBondingContract).toHaveBeenCalled()
    expect(useMulticallContract).toHaveBeenCalled()
    expect(useKeepAssetPoolContract).toHaveBeenCalled()
    expect(useTStakingContract).toHaveBeenCalled()
    expect(useKeepTokenStakingContract).toHaveBeenCalled()
    expect(useMulticall).toHaveBeenCalledWith([
      {
        interface: mockedMultiCallContract.interface,
        address: mockedMultiCallContract.address,
        method: "getEthBalance",
        args: [mockedKeepBondingContract.address],
      },
      {
        interface: tbtcContext.contract.interface,
        address: tbtcContext.contract.address,
        method: "totalSupply",
      },
      {
        interface: mockedKeepAssetPoolContract.interface,
        address: mockedKeepAssetPoolContract.address,
        method: "totalValue",
      },
      {
        interface: keepContext.contract.interface,
        address: keepContext.contract.address,
        method: "balanceOf",
        args: [mockedKeepTokenStakingContract.address],
      },
      {
        interface: tContext.contract.interface,
        address: tContext.contract.address,
        method: "balanceOf",
        args: [mockedTStakingContract.address],
      },
    ])

    result.current[1]()

    await waitForNextUpdate()

    expect(multicallRequest).toHaveBeenCalled()
    expect(spyOnFormatUnits).toHaveBeenCalledTimes(
      multicallRequestResult.length
    )
    // The `toUsdBalance` function was called 2x times because it was called
    // first on mount for every value and then after fetching on-chain data.
    expect(spyOnToUsdBalance).toHaveBeenCalledTimes(
      multicallRequestResult.length * 2
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      6,
      ethInKeepBonding.format,
      mockedETHData.usdPrice
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      7,
      tbtcTokenTotalSupply.format,
      tbtcContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      8,
      coveragePoolTvl.format,
      keepContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      9,
      keepStaking.format,
      keepContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      10,
      tStaking.format,
      tContext.usdConversion
    )

    expect(result.current[0]).toEqual(expectedResult)
  })
})
