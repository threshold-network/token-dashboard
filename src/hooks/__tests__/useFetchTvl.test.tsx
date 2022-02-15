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
  useNuStakingEscrowContract,
  useNuWorkLockContract,
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
  useNuStakingEscrowContract: jest.fn(),
  useNuWorkLockContract: jest.fn(),
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
  const mockedMultiCallContract = {}
  const mockedKeepAssetPoolContract = {}
  const mockedNuWorkLockContrarct = { address: "0x3" }
  const mockedNuStakingEscrowContract = { address: "0x4" }

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
    ;(useNuStakingEscrowContract as jest.Mock).mockReturnValue(
      mockedNuStakingEscrowContract
    )
    ;(useNuWorkLockContract as jest.Mock).mockReturnValue(
      mockedNuWorkLockContrarct
    )
  })

  test("should fetch tvl data correctly.", async () => {
    // given
    const ethInKeepBonding = { raw: "10000000000000000000", format: "10.0" }
    const tbtcTokenTotalSupply = { raw: "5000000000000000000", format: "5.0" }
    const coveragePoolTvl = { raw: "300000000000000000000", format: "300.0" }
    const keepStaking = { raw: "500000000000000000000", format: "500.0" }
    const tStaking = { raw: "600000000000000000000", format: "600.0" }
    const nuTotalSupply = { raw: "7000000000000000000000", format: "7000.0" }
    const nuCurrentPeriodSupply = {
      raw: "800000000000000000000",
      format: "800.0",
    }
    const nuInStakingEscrow = {
      raw: "6500000000000000000000",
      format: "6500.0",
    }
    const ethInWorkLock = { raw: "1000000000000000000000", format: "1000.0" }

    const multicallRequestResult = [
      ethInKeepBonding.raw,
      tbtcTokenTotalSupply.raw,
      coveragePoolTvl.raw,
      keepStaking.raw,
      tStaking.raw,
      nuTotalSupply.raw,
      nuCurrentPeriodSupply.raw,
      nuInStakingEscrow.raw,
      ethInWorkLock.raw,
    ]

    multicallRequest.mockResolvedValue(multicallRequestResult)

    const spyOnFormatUnits = jest.spyOn(ethersUnits, "formatUnits")
    const spyOnToUsdBalance = jest.spyOn(usdUtils, "toUsdBalance")
    const spyOnUseToken = jest.spyOn(useTokenModule, "useToken")

    const haltedRewards =
      Number(nuTotalSupply.format) - Number(nuCurrentPeriodSupply.format)
    const stakedNU = Number(nuInStakingEscrow.format) - haltedRewards

    const _expectedResult = {
      ecdsa: ethInKeepBonding.format * mockedETHData.usdPrice,
      tbtc: tbtcTokenTotalSupply.format * tbtcContext.usdConversion,
      keepCoveragePool: coveragePoolTvl.format * keepContext.usdConversion,
      keepStaking: keepStaking.format * keepContext.usdConversion,
      tStaking: tStaking.format * tContext.usdConversion,
      nu:
        stakedNU * nuContext.usdConversion +
        Number(ethInWorkLock.format) * mockedETHData.usdPrice,
    }

    // `FixedNumber` from `@ethersproject/bignumber` adds trailing zero so we
    // need to do the same here.
    const expectedResult = {
      ecdsa: `${_expectedResult.ecdsa.toString()}.0`,
      tbtc: `${_expectedResult.tbtc.toString()}.0`,
      keepCoveragePool: `${_expectedResult.keepCoveragePool.toString()}.0`,
      keepStaking: `${_expectedResult.keepStaking.toString()}.0`,
      tStaking: `${_expectedResult.tStaking.toString()}.0`,
      nu: `${_expectedResult.nu.toString()}.0`,
      total: `${
        _expectedResult.ecdsa +
        _expectedResult.tbtc +
        _expectedResult.keepCoveragePool +
        _expectedResult.keepStaking +
        _expectedResult.tStaking +
        _expectedResult.nu
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
    expect(spyOnUseToken).toHaveBeenCalledWith(Token.Nu)
    expect(useNuStakingEscrowContract).toHaveBeenCalled()
    expect(useNuWorkLockContract).toHaveBeenCalled()
    expect(useKeepBondingContract).toHaveBeenCalled()
    expect(useMulticallContract).toHaveBeenCalled()
    expect(useKeepAssetPoolContract).toHaveBeenCalled()
    expect(useTStakingContract).toHaveBeenCalled()
    expect(useKeepTokenStakingContract).toHaveBeenCalled()
    expect(useMulticall).toHaveBeenCalledWith([
      {
        contract: mockedMultiCallContract,
        method: "getEthBalance",
        args: [mockedKeepBondingContract.address],
      },
      {
        contract: tbtcContext.contract,
        method: "totalSupply",
      },
      { contract: mockedKeepAssetPoolContract, method: "totalValue" },
      {
        contract: keepContext.contract,
        method: "balanceOf",
        args: [mockedKeepTokenStakingContract.address],
      },
      {
        contract: tContext.contract,
        method: "balanceOf",
        args: [mockedTStakingContract.address],
      },
      {
        contract: nuContext.contract,
        method: "totalSupply",
      },
      {
        contract: mockedNuStakingEscrowContract,
        method: "currentPeriodSupply",
      },
      {
        contract: nuContext.contract,
        method: "balanceOf",
        args: [mockedNuStakingEscrowContract.address],
      },
      {
        contract: mockedMultiCallContract,
        method: "getEthBalance",
        args: [mockedNuWorkLockContrarct.address],
      },
    ])

    result.current[1]()

    await waitForNextUpdate()

    expect(multicallRequest).toHaveBeenCalled()
    expect(spyOnFormatUnits).toHaveBeenCalledTimes(
      multicallRequestResult.length
    )

    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      8,
      ethInKeepBonding.format,
      mockedETHData.usdPrice
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      9,
      tbtcTokenTotalSupply.format,
      tbtcContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      10,
      coveragePoolTvl.format,
      keepContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      11,
      keepStaking.format,
      keepContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      12,
      tStaking.format,
      tContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      13,
      `${stakedNU.toString()}.0`,
      nuContext.usdConversion
    )
    expect(spyOnToUsdBalance).toHaveBeenNthCalledWith(
      14,
      ethInWorkLock.format,
      mockedETHData.usdPrice
    )

    expect(result.current[0]).toEqual(expectedResult)
  })
})
