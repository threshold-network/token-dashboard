import { useContract } from "./useContract"
import { default as AssetPool } from "@keep-network/coverage-pools/artifacts/KeepAssetPool.json"

export const useKeepAssetPoolContract = () => {
  return useContract(AssetPool.address, AssetPool.abi)
}
