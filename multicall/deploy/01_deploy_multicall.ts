import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deployer } = await getNamedAccounts()

  const Multicall = await deployments.deploy("Multicall", {
    from: deployer,
  })

  deployments.log(Multicall.address)
}

export default func

func.tags = ["Multicall"]
