import React from 'react'
import './_collectionpage.scss'
import CollectionBanner from '../../components/CollectionPage/CollectionBanner/CollectionBanner'
import CollectionList from '../../components/CollectionPage/CollectionList/CollectionList'

const CollectionPage = () => {
  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <CollectionBanner />
      <CollectionList />
    </div>
  )
}

export default CollectionPage