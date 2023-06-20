import Header from '../../components/Header'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3 } from '@3rdweb/hooks'
import { useNFTs, useContract, useAddress } from '@thirdweb-dev/react'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { useRouter } from 'next/router'
import NFTImage from '../../components/nft/NFTImage'
import GeneralDetails from '../../components/nft/GeneralDetails'
import ItemActivity from '../../components/nft/ItemActivity'
import Purchase from '../../components/nft/Purchase'

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}

const Nft = () => {
  const [selectedNft, setSelectedNft] = useState()
  const [listings, setListings] = useState([])
  const router = useRouter()

  const userAddress = useAddress()

  const contractAddress = '0xf0027883F49A7d03223f919bB5Cc1f3995e891C6'

  const NFTContract = useContract(contractAddress)
  // get all NFTs in the collection
  const getNFts = async () => {
    const nfts = await NFTContract?.contract?.erc721.getAll()
    const selectedNftItem = nfts.find(
      (nft) => nft?.metadata.id === router.query.nftId
    )

    setSelectedNft(selectedNftItem)
  }

  useEffect(() => {
    if (NFTContract?.contract) {
      getNFts()
    }
  }, [userAddress, NFTContract?.contract])

  const marketplaceContractAddress =
    '0x85Bc5b0737AD0Ba5C6269ADF4DA5c21ABe09F7bB'
  const marketplaceContract = useContract(marketplaceContractAddress)
  const getAllListingsMarketPlace = async () => {
    const marketplaces =
      await marketplaceContract?.contract?.directListings.getAll()
    setListings(marketplaces)
  }

  useEffect(() => {
    getAllListingsMarketPlace()
  }, [userAddress])

  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase
                isListed={router.query.isListed}
                selectedNft={selectedNft}
                listings={listings}
                marketPlaceModule={marketplaceContract}
                userAddress={userAddress}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  )
}

export default Nft
