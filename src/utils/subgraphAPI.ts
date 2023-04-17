import axios from "axios"

const TBTC_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/suntzu93/threshold-tbtc"

type TransactionRawResponse = {
  // Actual transaction hash where the tBTC tokens were minted.
  id: string
  timestamp: string
  deposits: {
    actualAmountReceived: string
    user: {
      // ETH address
      id: string
    }
  }[]
}

const mapToRecentDepositData = (transaction: TransactionRawResponse) => {
  const amount = transaction.deposits[0].actualAmountReceived
  const address = transaction.deposits[0].user.id
  const txHash = transaction.id
  const timestamp = +transaction.timestamp

  return {
    amount,
    address,
    txHash,
    timestamp,
  }
}

const fetchRecenttBTCDeposits = async (numberOfDeposits = 4) => {
  const response = await axios.post(TBTC_SUBGRAPH_URL, {
    query: `query {
        transactions(
          where: { description: "Minting Finalized" }
          first: ${numberOfDeposits}
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          timestamp
           deposits {
            actualAmountReceived
            user {
              id
            }
          }
        }
      }`,
  })

  if (response.data && response.data.errors) {
    const errorMsg = "Failed to fetch data from tBTC v2 subgraph API."
    console.error(errorMsg, response.data.errors)
    throw new Error(errorMsg)
  }

  return (response.data.data.transactions as TransactionRawResponse[]).map(
    mapToRecentDepositData
  )
}

export const subgraphAPI = {
  fetchRecenttBTCDeposits,
}
