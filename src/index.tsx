import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import TransportProvider from "./contexts/TransportProvider"

ReactDOM.render(
  <React.StrictMode>
    <TransportProvider>
      <App />
    </TransportProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
