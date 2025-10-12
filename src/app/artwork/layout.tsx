import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artwork',
};

const ArtworkLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="w-full">{children}</div>;
};

export default ArtworkLayout;
