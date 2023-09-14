import { useContract } from "./useContract"
import AssetPool from "@threshold-network/coverage-pools/artifacts/AssetPool.json"

export const useKeepAssetPoolContract = () => {
  return useContract(AssetPool.address, AssetPool.abi)
}
