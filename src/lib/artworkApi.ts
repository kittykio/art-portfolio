'use server';

import fs from 'fs';
import path from 'path';
import { ArtworkType } from '@/types/ArtworkType';
import { getCreatedDate, getModifiedDate } from '@/utils/getDate';
import { buildLike, searchLikeById } from './artworkAction';
import { IArtworkLikeDocument } from '@/models/artworkLikeModel';

const contentSource = 'artwork';

/**
 * Reads a JSON file and returns an array of ArtworkType.
 * ID is generated from createdDate + artwork.id.
 */
export async function getArtworkDetail(
  filePath: string,
  fileIndex: number,
): Promise<ArtworkType[]> {
  const data = await fs.promises.readFile(filePath, 'utf8');
  const jsonData = JSON.parse(data) as ArtworkType[];

  if (!Array.isArray(jsonData)) {
    throw new Error(`Invalid artwork JSON: ${filePath}. Expected an array of artworks.`);
  }

  const createdDate = getCreatedDate(filePath);
  const createdLocaleDate = createdDate.toLocaleDateString();
  const modifiedDate = getModifiedDate(filePath);

  const artworkPromises = jsonData.map(async (artwork) => {
    const id = Number(`${fileIndex}${artwork.id.toString().padStart(4, '0')}`);

    const doc = (await searchLikeById({ _id: id })) as IArtworkLikeDocument;

    const like = doc?.like ?? 0;

    return {
      ...artwork,
      id,
      like,
      createdDate,
      createdLocaleDate,
      modifiedDate,
    } as ArtworkType;
  });

  const artworksWithLikes: ArtworkType[] = await Promise.all(artworkPromises);

  return artworksWithLikes;
}

// --------------------------------------------------------------------------------

/**
 * Get all artworks from all JSON files
 */
export async function getAllArtworks(): Promise<ArtworkType[]> {
  const directory = path.join(process.cwd(), contentSource);

  const files = await fs.promises.readdir(directory);

  const filePromises = files.map((file, i) => {
    if (path.extname(file) === '.json') {
      const filePath = path.join(directory, file);
      return getArtworkDetail(filePath, i + 1);
    }
    return Promise.resolve([]);
  });

  const nestedArtworks = await Promise.all(filePromises);

  const allArtworks: ArtworkType[] = nestedArtworks.flat();

  await buildLike(allArtworks);

  return allArtworks;
}
