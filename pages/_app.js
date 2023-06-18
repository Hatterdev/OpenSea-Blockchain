import '../styles/globals.css'
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'

import { ThirdwebProvider } from '@thirdweb-dev/react'
import { Sepolia, Ethereum, Polygon } from '@thirdweb-dev/chains'
/**
 * The chain ID 4 represents the Rinkeby network
 * The `injected` connector is a web3 connection method used by Metamask
 */
const supportedChainIds = [4]
const connectors = {
  injected: {},
}

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      supportedChains={[Ethereum, Polygon, Sepolia]}
      // connectors={connectors}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp
