import React, { useEffect } from "react";
import MainHero from "../../components/Home/MainHero/MainHero";
import "./_home.scss";
import HomeStats from "../../components/Home/HomeStats/HomeStats";
import HomeInfo from "../../components/Home/HomeInfo/HomeInfo";
import TrendingSales from "../../components/Home/TrendingSales/TrendingSales";
import RecentlyListed from "../../components/Home/RecentlyListed/RecentlyListed";
import TrendingCollections from "../../components/Home/TrendingCollections/TrendingCollections";
import CollectionCategories from "../../components/Collections/CollectionCategories/CollectionCategories";
import FAQ from "../../components/Home/FAQ/FAQ";

const Home = ({
  allCollections,
  recentlyListedNfts,
  cfxPrice,
  handleAddFavoriteNft,
  handleRemoveFavoriteNft,
  userNftFavs,
  userNftFavsInitial,
  coinbase,
  onRefreshListings,
  recentlySoldNfts,chainId,newestCollections
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <MainHero allCollections={allCollections} recentlySoldNfts={recentlySoldNfts} newestCollections={newestCollections}/>
      {/* <HomeStats cfxPrice={cfxPrice} /> */}
      <HomeInfo />
      <TrendingSales
        recentlySoldNfts={recentlySoldNfts}
        cfxPrice={cfxPrice}
        allCollections={allCollections}
      />
      <RecentlyListed
        recentlyListedNfts={recentlyListedNfts}
        cfxPrice={cfxPrice}
        userNftFavs={userNftFavs}
        userNftFavsInitial={userNftFavsInitial}
        handleAddFavoriteNft={handleAddFavoriteNft}
        handleRemoveFavoriteNft={handleRemoveFavoriteNft}
        coinbase={coinbase}
        onRefreshListings={onRefreshListings}
        chainId={chainId}
        allCollections={allCollections}
      />
      <CollectionCategories allCollections={allCollections} />
      <FAQ />
    </div>
  );
};

export default Home;
