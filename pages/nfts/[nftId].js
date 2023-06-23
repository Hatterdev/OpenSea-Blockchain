import Header from '../../components/Header'
import { useEffect, useState } from 'react'
import { useContract, useAddress } from '@thirdweb-dev/react'
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
  const [listing, setListing] = useState({})
  const router = useRouter()

  const userAddress = useAddress()

  useEffect(() => {
    if (userAddress) {
      const nftItem = router?.query.nft
      const selectedItem = JSON.parse(nftItem)
      setSelectedNft(selectedItem)

      const listing = router?.query.listing
      const selectedListing = JSON.parse(listing)
      setListing(selectedListing)
    }
  }, [userAddress])

  const marketplaceContractAddress =
    '0x85Bc5b0737AD0Ba5C6269ADF4DA5c21ABe09F7bB'
  const marketplaceContract = useContract(marketplaceContractAddress)
  const getEvents = async () => {
    const filters = {
      fromBlock: 0,
      toBlock: 10000,
      order: 'desc',
    }

    const events = await marketplaceContract?.contract?.events?.getAllEvents(
      filters
    )
  }

  useEffect(() => {
    getEvents()
  }, [])

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
                listing={listing}
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
