import React from "react";
import styles from "./home.module.css";
import ExploreCategories from "../../ExploreCategories";
import FeaturedJobs from "../../FeaturedJobs";
import HeroSection from "../../HeroSection";

function Home() {
  return (
    <div className={styles.home}>
      <HeroSection />
      <ExploreCategories />
      <FeaturedJobs />
    </div>
  );
}

export default Home;
