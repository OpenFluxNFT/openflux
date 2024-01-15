import React, { useEffect } from "react";
import MainHero from "../../components/Home/MainHero/MainHero";
import "./_home.scss";
import HomeStats from "../../components/Home/HomeStats/HomeStats";
import HomeInfo from "../../components/Home/HomeInfo/HomeInfo";
import TrendingSales from "../../components/Home/TrendingSales/TrendingSales";
import RecentlyListed from "../../components/Home/RecentlyListed/RecentlyListed";
import TrendingCollections from "../../components/Home/TrendingCollections/TrendingCollections";
import CollectionCategories from "../../components/Collections/CollectionCategories/CollectionCategories";

const Home = ({allCollections}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container-fluid py-4 home-wrapper px-0">
      <MainHero />
      <HomeStats />
      <HomeInfo />
      <TrendingSales />
      <RecentlyListed />
      <CollectionCategories allCollections={allCollections}/>
    </div>
  );
};

export default Home;
