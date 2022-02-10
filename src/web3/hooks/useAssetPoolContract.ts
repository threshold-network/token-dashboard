import { useContract } from "./useContract"
import AssetPool from "@keep-network/coverage-pools/artifacts/KeepAssetPool.json"

export const useKeepAssetPoolContract = () => {
  return useContract(AssetPool.address, AssetPool.abi)
}
