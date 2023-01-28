import { formatTokenAmount } from "../formatAmount"

describe("Format token amount test", () => {
  const decimals = 18
  const precision = 2
  const displayTildeBelow = 1

  test("should display zero if it is zero", () => {
    expect(formatTokenAmount(0)).toBe("0")
  })

  test.each`
    amount
    ${"1000000000000000"}
    ${"9999900000000000"}
    ${"9999999999999900"}
    ${"5000000000000000"}
    ${"50000000000000"}
  `(
    "should display `<` if an amount($amount) is less than decimals precision",
    ({ amount }) => {
      const result = formatTokenAmount(amount, undefined, decimals, precision)

      expect(result).toBe("<0.01")
    }
  )

  test("should display tilde only if the amount is below a given amount", () => {
    const amount = "968000000000000000" // 0.968
    const amount2 = "9967000000000000000" // 9.967
    const amount3 = "12000000000000000" // 0.012

    const result = formatTokenAmount(
      amount,
      undefined,
      decimals,
      precision,
      displayTildeBelow
    )

    const result2 = formatTokenAmount(
      amount2,
      undefined,
      decimals,
      precision,
      displayTildeBelow
    )

    const result3 = formatTokenAmount(
      amount3,
      undefined,
      decimals,
      precision,
      displayTildeBelow
    )

    expect(result).toBe("~0.97")
    expect(result2).toBe("9.97")
    expect(result3).toBe("~0.01")
  })

  test("should not display the tilde if the rounded amount is equal to the given amount", () => {
    const amount = "120000000000000000" // 0.12

    const result = formatTokenAmount(
      amount,
      undefined,
      decimals,
      precision,
      displayTildeBelow
    )

    expect(result).toBe("0.12")
  })

  test("should display amount with a given precision correctly", () => {
    const precision = 6
    const amount = "10000000000000" // 0.00001
    const amount2 = "39980020000000" // 0.00003998002
    const amount3 = "36000000000000" // 0,00003600000

    const result = formatTokenAmount(
      amount,
      undefined,
      decimals,
      precision,
      displayTildeBelow
    )

    const result2 = formatTokenAmount(
      amount2,
      undefined,
      decimals,
      precision,
      displayTildeBelow
    )

    const result3 = formatTokenAmount(
      amount3,
      undefined,
      decimals,
      precision,
      displayTildeBelow
    )

    expect(result).toBe("0.00001")
    expect(result2).toBe("~0.00004")
    expect(result3).toBe("0.000036")
  })
})
