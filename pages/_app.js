import '../styles/globals.css'
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'

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
    <ThirdwebWeb3Provider
      activeChain={Sepolia}
      supportedChains={[Ethereum, Polygon, Sepolia]}
      connectors={connectors}
    >
      <Component {...pageProps} />
    </ThirdwebWeb3Provider>
  )
}

export default MyApp
