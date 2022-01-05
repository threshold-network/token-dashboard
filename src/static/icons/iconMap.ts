import Icon from "../../enums/icon"
import KeepCircleBrand from "./KeepCircleBrand"
import NuCircleBrand from "./NuCircleBrand"
import ThresholdCircleBrand from "./ThresholdCircleBrand"

const iconMap: { [icon in Icon]: any } = {
  [Icon.KeepCircleBrand]: KeepCircleBrand,
  [Icon.NuCircleBrand]: NuCircleBrand,
  [Icon.TCircleBrand]: ThresholdCircleBrand,
}

export default iconMap
