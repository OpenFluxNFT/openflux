import React, {useEffect} from 'react'
import './_collections.scss'
import TopCollections from '../../components/Collections/TopCollections/TopCollections'
import TrendingCollections from '../../components/Collections/TrendingCollections/TrendingCollections'
import CollectionCategories from '../../components/Collections/CollectionCategories/CollectionCategories'

const Collections = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
    <TopCollections />
    <TrendingCollections />
    <CollectionCategories />
  </div>
  )
}

export default Collections