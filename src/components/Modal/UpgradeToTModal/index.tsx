import TransactionIdle from "./TransactionIdle"
import TransactionSuccess from "./TransactionSuccess"

export { TransactionIdle, TransactionSuccess }

// const UpgradeTransactionModal: FC<{ closeModal: () => void }> = ({
//   closeModal,
// }) => {
//   // TODO: Compute these values from a transasction store
//   const { upgradeToT, status } = useUpgradeToT(Token.Keep)

//   const upgradedAmount = 1000000.68
//   const receivedAmount = 4870003.31
//   const exchangeRate = 4.87
//   const transactionId = "0x_TRANSACTION_ID"
//   const upgradedToken = Token.Keep
//   const transactionError = `Error: call revert exception (method="getTokenAmount(uint256)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)\n' +
//     "    at Logger.makeError (index.ts:213)\n" +
//     "    at Logger.throwError (index.ts:225)\n" +
//     "    at Interface.decodeFunctionResult (interface.ts:425)\n" +
//     "    at Contract.<anonymous> (index.ts:332)\n" +
//     "    at Generator.next (<anonymous>)\n" +
//     "    at fulfilled (index.ts:2)\n"
//     "    at Logger.makeError (index.ts:213)\n" +
//     "    at Logger.throwError (index.ts:225)\n" +
//     "    at Interface.decodeFunctionResult (interface.ts:425)\n" +
//     "    at Contract.<anonymous> (index.ts:332)\n" +
//     "    at Generator.next (<anonymous>)\n" +
//     "    at fulfilled (index.ts:2)\n"`

//   const ModalScreen = useMemo(() => {
//     switch (status) {
//       case TransactionStatus.Idle: {
//         return (
//           <TransactionIdle
//             upgradedAmount={upgradedAmount}
//             receivedAmount={receivedAmount}
//             exchangeRate={exchangeRate}
//             transactionId={transactionId}
//             token={upgradedToken}
//           />
//         )
//       }

//       case TransactionStatus.PendingSignature: {
//         return (
//           <TransactionPending
//             modalTitle="1/2 Sign Approval"
//             pendingText="Please, sign the approval in your wallet."
//             withFooter
//             closeBtnText="Close"
//           />
//         )
//       }

//       case TransactionStatus.PendingApproval: {
//         return (
//           <TransactionPending
//             modalTitle="2/2 Confirm Upgrade"
//             pendingText="Please, confirm your upgrade in your wallet."
//             withFooter
//             closeBtnText="Confirm"
//           />
//         )
//       }

//       case TransactionStatus.InFlight: {
//         return (
//           <TransactionPending
//             modalTitle={
//               <HStack>
//                 <H5>1/2 Sign Approval</H5> <Body3>(pending)</Body3>
//               </HStack>
//             }
//             pendingText="Pending..."
//             transactionId={transactionId}
//           />
//         )
//       }

//       case TransactionStatus.Failed: {
//         return (
//           <TransactionFailed
//             transactionId={transactionId}
//             error={transactionError}
//             isExpandableError
//           />
//         )
//       }

//       case TransactionStatus.Succeeded: {
//         return (
//           <TransactionSuccess
//             upgradedAmount={upgradedAmount}
//             receivedAmount={receivedAmount}
//             exchangeRate={exchangeRate}
//             transactionId={transactionId}
//             token={upgradedToken}
//           />
//         )
//       }
//     }
//   }, [transactionStatus])

//   return ModalScreen
// }
// export default withBaseModal(UpgradeTransactionModal)
