import InterestsSection from '@/app/components/interest-section/InterestSection';
import HeroSection from '@/app/components/HeroSection';
import ArtworkSection from '@/app/components/ArtworkSection';
import BlogSection from '@/app/components/BlogSection';
import { getAllPosts } from '@/lib/blogApi';
import ExperienceSection from '@/app/components/ExperienceSection';
import GetToKnowMeSection from '@/app/components/GetToKnowMeSection';
import { getAllArtworks } from '@/lib/artworkApi';
import IntroSection from '@/app/components/IntroSection';

const HomePage = async () => {
  const posts = await getAllPosts();
  const artworks = await getAllArtworks();

  return (
    <>
      <HeroSection />
      <IntroSection />
      <InterestsSection />
      <GetToKnowMeSection />
      <ArtworkSection artworks={artworks} />
      <BlogSection posts={posts} />
      <ExperienceSection />
    </>
  );
};

export default HomePage;
