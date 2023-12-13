import { RangeOperatorType } from "../types"

type MapType = { [key in RangeOperatorType]: string }

const signsMap: MapType = {
  greater: ">",
  less: "<",
  greaterOrEqual: "≥",
  lessOrEqual: "≤;",
}

/**
 * Returns the range sign for a given range operator.
 * @param {RangeOperatorType} operator - The range operator to get the sign for.
 * @return {string} The range sign for the given range operator in form of HTML entity.
 */
export const getRangeSign = (operator: RangeOperatorType) =>
  signsMap[operator] ?? operator
