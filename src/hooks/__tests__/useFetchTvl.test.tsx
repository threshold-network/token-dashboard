import { renderHook } from "@testing-library/react-hooks"
import * as ethersUnits from "@ethersproject/units"
import { Token } from "../../enums"
import {
  useAssetPoolContract,
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
import { useTBTCv2TokenContract } from "../../web3/hooks/useTBTCv2TokenContract"
import { FC } from "react"

jest.mock("../../web3/hooks", () => ({
  ...(jest.requireActual("../../web3/hooks") as {}),
  useAssetPoolContract: jest.fn(),
  useKeepAssetPoolContract: jest.fn(),
  useKeepBondingContract: jest.fn(),
  useKeepTokenStakingContract: jest.fn(),
  useMulticall: jest.fn(),
  useMulticallContract: jest.fn(),
  useTStakingContract: jest.fn(),
}))

jest.mock("../../web3/hooks/useTBTCv2TokenContract", () => ({
  ...(jest.requireActual("../../web3/hooks/useTBTCv2TokenContract") as {}),
  useTBTCv2TokenContract: jest.fn(),
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
  const tbtcv1Context = {
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
  const tBTCContext = {
    contract: {} as any,
    usdConversion: 2,
  } as any
  const mockedKeepTokenStakingContract = { address: "0x1" }
  const mockedKeepBondingContract = { address: "0x0" }
  const mockedTStakingContract = { address: "0x2" }
  const mockedMultiCallContract = { interface: {}, address: "0x3" }
  const mockedAssetPoolContract = { interface: {}, address: "0x4" }
  const mockedKeepAssetPoolContract = { interface: {}, address: "0x5" }
  const mockedtBTCTokenContract = { interface: {}, address: "0x6" }

  const wrapper: FC = ({ children }) => (
    <TokenContext.Provider
      value={{
        [Token.Keep]: keepContext,
        [Token.TBTC]: tbtcv1Context,
        [Token.T]: tContext,
        [Token.Nu]: nuContext,
        [Token.TBTCV2]: tBTCContext,
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
    ;(useAssetPoolContract as jest.Mock).mockReturnValue(
      mockedAssetPoolContract
    )
    ;(useKeepAssetPoolContract as jest.Mock).mockReturnValue(
      mockedKeepAssetPoolContract
    )
    ;(useTStakingContract as jest.Mock).mockReturnValue(mockedTStakingContract)
    ;(useKeepTokenStakingContract as jest.Mock).mockReturnValue(
      mockedKeepTokenStakingContract
    )
    ;(useTBTCv2TokenContract as jest.Mock).mockReturnValue(
      mockedtBTCTokenContract
    )
  })

  test("should fetch tvl data correctly.", async () => {
    // given
    const ethInKeepBonding = { raw: "10000000000000000000", format: "10.0" }
    const tbtcTokenTotalSupply = { raw: "5000000000000000000", format: "5.0" }
    const coveragePoolTvl = { raw: "500000000000000000000", format: "500.0" }
    const keepCoveragePoolTvl = {
      raw: "300000000000000000000",
      format: "300.0",
    }
    const keepStaking = { raw: "500000000000000000000", format: "500.0" }
    const tStaking = { raw: "600000000000000000000", format: "600.0" }
    const tBTC = { raw: "700000000000000000000", format: "700.0" }

    const multicallRequestResult = [
      ethInKeepBonding.raw,
      tbtcTokenTotalSupply.raw,
      coveragePoolTvl.raw,
      keepCoveragePoolTvl.raw,
      keepStaking.raw,
      tStaking.raw,
      tBTC.raw,
    ]

    multicallRequest.mockResolvedValue(multicallRequestResult)

    const spyOnFormatUnits = jest.spyOn(ethersUnits, "formatUnits")
    const spyOnToUsdBalance = jest.spyOn(usdUtils, "toUsdBalance")
    const spyOnUseToken = jest.spyOn(useTokenModule, "useToken")

    const _expectedResult = {
      ecdsa: +ethInKeepBonding.format * mockedETHData.usdPrice,
      tbtc: +tbtcTokenTotalSupply.format * tbtcv1Context.usdConversion,
      coveragePool: +coveragePoolTvl.format * tContext.usdConversion,
      keepCoveragePool: +keepCoveragePoolTvl.format * keepContext.usdConversion,
      keepStaking: +keepStaking.format * keepContext.usdConversion,
      tStaking: +tStaking.format * tContext.usdConversion,
      tBTC: +tBTC.format * tBTCContext.usdConversion,
    }

    // `FixedNumber` from `@ethersproject/bignumber` adds trailing zero so we
    // need to do the same here.
    const expectedResult = {
      ecdsa: `${_expectedResult.ecdsa.toString()}.0`,
      tbtcv1: `${_expectedResult.tbtc.toString()}.0`,
      coveragePool: `${_expectedResult.coveragePool.toString()}.0`,
      keepCoveragePool: `${_expectedResult.keepCoveragePool.toString()}.0`,
      keepStaking: `${_expectedResult.keepStaking.toString()}.0`,
      tStaking: `${_expectedResult.tStaking.toString()}.0`,
      tBTC: `${_expectedResult.tBTC.toString()}.0`,
      total: `${
        _expectedResult.ecdsa +
        _expectedResult.tbtc +
        _expectedResult.coveragePool +
        _expectedResult.keepCoveragePool +
        _expectedResult.keepStaking +
        _expectedResult.tStaking +
        _expectedResult.tBTC
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
    expect(spyOnUseToken).toHaveBeenCalledWith(Token.TBTCV2)
    expect(useKeepBondingContract).toHaveBeenCalled()
    expect(useMulticallContract).toHaveBeenCalled()
    expect(useAssetPoolContract).toHaveBeenCalled()
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
        interface: tbtcv1Context.contract.interface,
        address: tbtcv1Context.contract.address,
        method: "totalSupply",
      },
      {
        interface: mockedAssetPoolContract.interface,
        address: mockedAssetPoolContract.address,
        method: "totalValue",
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
      {
        interface: tBTCContext.contract.interface,
        address: tBTCContext.contract.address,
        method: "totalSupply",
      },
    ])

    result.current[1]()

    await waitForNextUpdate()

    expect(multicallRequest).toHaveBeenCalled()

    // The `toUsdBalance` and `spyOnFormatUnits` function were called 2x times
    // because they were called called first on mount for every value and then
    // after fetching on-chain data.
    expect(spyOnToUsdBalance).toHaveBeenCalledTimes(
      multicallRequestResult.length * 2
    )
    expect(spyOnFormatUnits).toHaveBeenCalledTimes(
      multicallRequestResult.length * 2
    )

    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      8,
      ethInKeepBonding.format,
      mockedETHData.usdPrice
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      9,
      tbtcTokenTotalSupply.format,
      tbtcv1Context.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      10,
      tBTC.format,
      tBTCContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      11,
      coveragePoolTvl.format,
      tContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      12,
      keepCoveragePoolTvl.format,
      keepContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      13,
      keepStaking.format,
      keepContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      14,
      tStaking.format,
      tContext.usdConversion
    )

    expect(result.current[0]).toEqual(expectedResult)
  })
})
