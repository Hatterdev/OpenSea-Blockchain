import React, { useEffect, useState } from 'react'
import { useRouter, withRouter } from 'next/router'
import Image from 'next/image'
import { useContract, useAddress } from '@thirdweb-dev/react'
import { client } from '../../lib/sanityClient'
import Header from '../../components/Header'
import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import NFTCard from '../../components/NFTCard'

import loader from '../../assets/loader.svg'

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
}

const Collection = () => {
  const router = useRouter()
  const { collectionId } = router.query
  const [collection, setCollection] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])

  const userAddress = useAddress()
  const contractAddress = '0xf0027883F49A7d03223f919bB5Cc1f3995e891C6'
  const NFTContract = useContract(contractAddress)

  // get all NFTs in the collection
  const getNFts = async () => {
    const data = await NFTContract?.contract?.erc721.getAll()
    setNfts(data)
    return data
  }

  useEffect(() => {
    if (NFTContract?.contract) {
      getNFts()
    }
  }, [userAddress, NFTContract?.contract])

  // get all listings in the collection
  const marketplaceContractAddress =
    '0x85Bc5b0737AD0Ba5C6269ADF4DA5c21ABe09F7bB'
  const marketplaceContract = useContract(marketplaceContractAddress)
  const getAllListingsMarketPlace = async () => {
    const marketplaces =
      await marketplaceContract?.contract?.directListings.getAllValid()
    if (marketplaces) {
      setListings(marketplaces)
    }
    return marketplaces
  }

  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    if (collectionId) {
      const collectionData = await sanityClient.fetch(query)
      setCollection(collectionData[0])
      return collectionData[0]
    }
  }

  const getALL = () => {
    Promise.all([
      getNFts(),
      fetchCollectionData(),
      getAllListingsMarketPlace(),
    ]).finally(() => {
      if (nfts && collection && listings) {
        setIsLoading(false)
      }
    })
  }

  useEffect(() => {
    getALL()
  }, [
    collectionId,
    userAddress,
    NFTContract?.contract,
    marketplaceContract?.contract,
  ])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : 'https://via.placeholder.com/200'
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : 'https://via.placeholder.com/200'
            }
            alt="profile image"
          />
        </div>
        {isLoading && (
          <>
            <div className="flex h-[50vh] items-center justify-center">
              <Image
                src={loader}
                alt="loader"
                className="h-[100px] w-[100px] object-contain"
              />
            </div>
          </>
        )}
        {!isLoading && (
          <>
            <div className={style.endRow}>
              <div className={style.socialIconsContainer}>
                <div className={style.socialIconsWrapper}>
                  <div className={style.socialIconsContent}>
                    <div className={style.socialIcon}>
                      <CgWebsite />
                    </div>
                    <div className={style.divider} />
                    <div className={style.socialIcon}>
                      <AiOutlineInstagram />
                    </div>
                    <div className={style.divider} />
                    <div className={style.socialIcon}>
                      <AiOutlineTwitter />
                    </div>
                    <div className={style.divider} />
                    <div className={style.socialIcon}>
                      <HiDotsVertical />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.midRow}>
              <div className={style.title}>{collection?.title}</div>
            </div>
            <div className={style.midRow}>
              <div className={style.createdBy}>
                Created by{' '}
                <span className="text-[#2081e2]">{collection?.creator}</span>
              </div>
            </div>
            <div className={style.midRow}>
              <div className={style.statsContainer}>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>{nfts?.length}</div>
                  <div className={style.statName}>items</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>
                    {collection?.allOwners ? collection.allOwners.length : ''}
                  </div>
                  <div className={style.statName}>owners</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>
                    <img
                      src="https://blog.logomyway.com/wp-content/uploads/2021/11/Ethereum-logo.png"
                      alt="eth"
                      className={style.ethLogo}
                    />
                    {collection?.floorPrice}
                  </div>
                  <div className={style.statName}>floor price</div>
                </div>
                <div className={style.collectionStat}>
                  <div className={style.statValue}>
                    {collection?.volumeTraded}.5K
                  </div>
                  <div className={style.statName}>volume traded</div>
                </div>
              </div>
            </div>
            <div className={style.midRow}>
              <div className={style.description}>{collection?.description}</div>
            </div>
          </>
        )}
      </div>
      {!isLoading && (
        <div className="flex flex-wrap">
          {nfts?.map((nftItem, id) => (
            <NFTCard
              key={id}
              nftItem={nftItem?.metadata}
              nft={nftItem}
              title={collection?.title}
              listings={listings}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default withRouter(Collection)
