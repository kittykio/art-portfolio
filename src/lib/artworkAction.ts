'use server';

import ArtworkCollection, { IArtworkLikeDocument } from '@/models/artworkLikeModel';
import { ArtworkType } from '@/types/ArtworkType';

// --- Type Definitions for Consistency ---
type IdInput = { _id: number };
type LikeDocResult = IArtworkLikeDocument | null;

// --- Database Operations (Type-Safe & Consistent Returns) ---

/**
 * Creates a new document with like count initialized to 0.
 */
export const createNewLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await ArtworkCollection.create({
      _id,
      like: 0,
    });
  } catch (error) {
    console.error(`Failed to create document with ID ${_id}. Error:`, error);
    return null;
  }
};

/**
 * Search a single document by its _id field.
 */
export const searchLikeById = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    // Mongoose findById returns the document or null
    return await ArtworkCollection.findById(_id);
  } catch (error) {
    console.error(`Error searching document with ID ${_id}. Error:`, error);
    return null;
  }
};

/**
 * Search a list of documents that match filter.
 * Guaranteed to return an array, empty if no documents found or on error.
 */
export const searchAllLike = async (
  params?: Partial<IArtworkLikeDocument>,
): Promise<IArtworkLikeDocument[]> => {
  try {
    // Return empty array if no documents found or on error
    return await ArtworkCollection.find(params || {});
  } catch (error) {
    console.error('Error searching all documents. Error:', error);
    return [];
  }
};

/**
 * Search the given document and deletes it.
 */
export const deleteLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    // findOneAndDelete returns the deleted document or null
    return await ArtworkCollection.findOneAndDelete({ _id });
  } catch (error) {
    console.error(`Failed to delete document with ID ${_id}. Error:`, error);
    return null;
  }
};

/**
 * Updates the document's like field atomically.
 */
export const updateLike = async ({
  _id,
  seconds,
}: {
  _id: number;
  seconds: number;
}): Promise<number> => {
  try {
    // Use $inc for atomic update, which is safer and often faster than find + update
    const updatedDoc = await ArtworkCollection.findByIdAndUpdate(
      _id,
      { $inc: { like: seconds } }, // $inc increments the 'like' field
      { new: true }, // Return the updated document
    );

    if (!updatedDoc) {
      console.warn(`Document with id ${_id} not found for update.`);
      return 0;
    }

    return updatedDoc.like ?? 0;
  } catch (error) {
    console.error(`Failed to update document with ID ${_id}. Error:`, error);
    return 0;
  }
};

// --- Synchronization Logic (buildLike) ---

/**
 * Synchronizes the database collection with the local artworks.
 * Creates new documents for missing artworks and deletes documents for removed artworks.
 *
 * @param artworks Fetched artworks from local.
 * @returns A promise that resolves when the build is successful.
 * @async
 */
export const buildLike = async (artworks: ArtworkType[]): Promise<void> => {
  try {
    // searchAllLike now guarantees an array, avoiding null/undefined checks
    const allDocs = await searchAllLike();

    // Create Sets for fast O(1) lookups: better than array iteration
    const dbIds = new Set(allDocs.map((doc) => doc._id));
    const artworkIds = new Set(artworks.map((artwork) => artwork.id));

    // 1. Identify and Delete Removed Artworks
    // Find documents in DB that are NOT in the current artwork list
    const docsToDelete = allDocs.filter((doc) => !artworkIds.has(doc._id));

    if (docsToDelete.length > 0) {
      console.log(`Found ${docsToDelete.length} documents to delete.`);

      // Use Promise.all to await all asynchronous deletions concurrently
      await Promise.all(docsToDelete.map((doc) => deleteLike({ _id: doc._id })));
    }

    // 2. Identify and Create New Artworks
    // Find artworks in the list that are NOT in the DB
    const artworksToCreate = artworks.filter((artwork) => !dbIds.has(artwork.id));

    if (artworksToCreate.length > 0) {
      console.log(`Found ${artworksToCreate.length} artworks to create.`);

      // Use Promise.all to await all asynchronous creations concurrently
      await Promise.all(artworksToCreate.map((artwork) => createNewLike({ _id: artwork.id })));
    }

    console.log('Artwork like collection build completed successfully.');
  } catch (error) {
    // Catch any remaining unexpected errors
    console.error(`Failed to build collection for artwork. Error:`, error);
  }
};
