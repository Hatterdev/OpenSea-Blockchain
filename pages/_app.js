import Head from 'next/head'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { Sepolia, Ethereum, Polygon } from '@thirdweb-dev/chains'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      supportedChains={[Ethereum, Polygon, Sepolia]}
    >
      <Head>
        <link rel="icon" href="/opensea.png" type="image/png" sizes="32x32" />
        <title>GIC SPORT</title>
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp
