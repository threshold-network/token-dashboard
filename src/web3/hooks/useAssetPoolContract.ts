import { useContract } from "./useContract"
import AssetPool from "@keep-network/coverage-pools/artifacts/AssetPool.json"

export const useKeepAssetPoolContract = () => {
  return useContract(AssetPool.address, AssetPool.abi)
}
