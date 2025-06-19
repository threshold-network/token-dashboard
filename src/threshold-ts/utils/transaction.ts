import { TransactionReceipt } from "@ethersproject/abstract-provider"
import { Hex } from "@keep-network/tbtc-v2.ts"

export const isReceipt = (arg: unknown): arg is TransactionReceipt =>
  !!arg &&
  typeof arg === "object" &&
  // the two properties below exist on both v5 and v6 receipts :contentReference[oaicite:0]{index=0}
  "blockHash" in arg &&
  ("transactionHash" in arg || "hash" in arg)

export const isHexLike = (arg: unknown): arg is Hex =>
  !!arg &&
  typeof arg === "object" &&
  typeof (arg as any).toPrefixedString === "function"
