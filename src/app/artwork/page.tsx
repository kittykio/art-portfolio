import ArtworkPageClient from '@/app/artwork/components/ArtworkPageClient';
import { getAllArtworks } from '@/lib/artworkApi';
import { ArtworkType } from '@/types/ArtworkType';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

const ArtworkPage = async () => {
  const artworks: ArtworkType[] = await getAllArtworks();

  return <ArtworkPageClient initialArtworks={artworks} />;
};

export default ArtworkPage;
