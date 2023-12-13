import React from 'react'
import './_collections.scss'
import TopCollections from '../../components/Collections/TopCollections/TopCollections'
import TrendingCollections from '../../components/Collections/TrendingCollections/TrendingCollections'
import CollectionCategories from '../../components/Collections/CollectionCategories/CollectionCategories'

const Collections = () => {
  return (
    <div className="container-fluid py-4 home-wrapper px-0">
    <TopCollections />
    <TrendingCollections />
    <CollectionCategories />
  </div>
  )
}

export default Collections