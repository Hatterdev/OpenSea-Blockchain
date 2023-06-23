import { useEffect, useState } from 'react'
import { NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk'
import { HiTag } from 'react-icons/hi'
import { IoMdWallet } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
}

const Purchase = ({
  isListed,
  selectedNft,
  listing,
  marketPlaceModule,
  userAddress,
}) => {
  const [enableButton, setEnableButton] = useState(false)

  useEffect(() => {
    if (!listing || !isListed) return
    setEnableButton(true)
  }, [listing, selectedNft?.metadata])

  const confirmPurchase = (error, toastHandler = toast) => {
    if (error) {
      toastHandler.error(`Purchase failed, ${error?.reason}!`, {
        style: {
          background: '#eb4034',
          color: '#fff',
        },
      })
    } else {
      toastHandler.success(`Purchase successful!`, {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      })
    }
  }

  const buyItem = async (
    listingId,
    quantityDesired = 1,
    module = marketPlaceModule
  ) => {
    await module?.contract?.directListings
      .buyFromListing(listingId, quantityDesired, userAddress)
      .then(() => {
        confirmPurchase()
      })
      .catch((error) => {
        confirmPurchase(error)
      })
  }

  const makeOffer = async () => {
    // Data of the offer you want to make
    const offer = {
      // address of the contract the asset you want to make an offer for
      assetContractAddress: listing?.assetContractAddress,
      // token ID of the asset you want to buy
      tokenId: listing?.tokenId,
      // how many of the asset you want to buy
      quantity: 1,
      // address of the currency contract that you offer to pay in
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      // Total price you offer to pay for the mentioned token(s)
      totalPrice: '0.011',
      // Offer valid until
      endTimestamp: new Date(),
    }

    await marketPlaceModule?.contract?.offers
      .makeOffer(offer)
      .then((tx) => {
        const receipt = tx.receipt // the transaction receipt
        const id = tx.id // the id of the newly created offer
        toast.success(`Make offer success!`, {
          style: {
            background: '#04111d',
            color: '#fff',
          },
        })
      })
      .catch((error) => {
        toast.error(`Make Offer fail, ${error?.reason}!`, {
          style: {
            background: '#eb4034',
            color: '#fff',
          },
        })
      })
  }

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="bottom-left" reverseOrder={false} />
      {isListed === 'true' ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(listing?.id, 1) : null
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div onClick={makeOffer} className={style.buttonText}>
              Make Offer
            </div>
          </div>
        </>
      ) : (
        <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </div>
      )}
    </div>
  )
}

export default Purchase
