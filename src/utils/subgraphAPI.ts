import axios from "axios"

const TBTC_SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/suntzu93/threshold-tbtc"

const LIMIT_FOR_ONE_QUERY = 1000

type TransactionRawResponse = {
  // Actual transaction hash where the tBTC tokens were minted.
  id: string
  // Unix timestamps in seconds.
  timestamp: string
  deposits: {
    actualAmountReceived: string
    user: {
      // ETH address
      id: string
    }
  }[]
}

export type tBTCMetrics = {
  totalHolders: string
  totalMints: number
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

const fetchRecentTBTCDeposits = async (numberOfDeposits = 4) => {
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

const fetchTotalMints = async () => {
  let lastId = ""
  let totalMints = 0
  let numberOfMintsFromQuery = LIMIT_FOR_ONE_QUERY

  do {
    const query = `
      query {
        transactions(
          where: { description: "Minting Finalized" , id_gt: "${lastId}" }
          orderBy: id
          orderDirection: asc
          first: ${LIMIT_FOR_ONE_QUERY}
        ) {
          id
        }
      }
    `

    const response: {
      data: { data: { transactions: { id: string }[] } }
    } = await axios.post(TBTC_SUBGRAPH_URL, { query })

    const result = response.data.data

    numberOfMintsFromQuery = result.transactions.length
    totalMints += numberOfMintsFromQuery
    lastId = result.transactions[numberOfMintsFromQuery - 1].id
  } while (numberOfMintsFromQuery === LIMIT_FOR_ONE_QUERY)

  return totalMints
}

const fetchTBTCMetrics = async (): Promise<tBTCMetrics> => {
  const [tokenResponse, totalMints] = await Promise.all([
    axios.post(TBTC_SUBGRAPH_URL, {
      query: `query {
        tbtctoken(id: "TBTCToken") {
          currentTokenHolders
        }
      }`,
    }),
    fetchTotalMints(),
  ])

  const totalHolders = tokenResponse.data.data.tbtctoken.currentTokenHolders

  return {
    totalHolders,
    totalMints,
  }
}

export const subgraphAPI = {
  fetchRecentTBTCDeposits,
  fetchTBTCMetrics,
}
