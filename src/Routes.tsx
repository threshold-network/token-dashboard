import { Switch, Route } from "react-router-dom"
import Overview from "./pages/Overview"
import Balances from "./pages/Balances"
import Upgrade from "./pages/Upgrade"

const Routes = () => {
  return (
    <Switch>
      <Route path="/overview" component={Overview} />
      <Route path="/upgrade" component={Upgrade} />
      <Route path="/balances" component={Balances} />
    </Switch>
  )
}

export default Routes
