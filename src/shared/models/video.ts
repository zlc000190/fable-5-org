import { and, count, desc, eq } from 'drizzle-orm';

import { video } from '@/config/db/schema';
import { db } from '@/core/db';

/**
 * Insert a new video record
 */
export async function insertVideo(
  data: typeof video.$inferInsert
): Promise<typeof video.$inferSelect | undefined> {
  const [result] = await db().insert(video).values(data).returning();
  return result;
}

/**
 * Update video record by ID
 */
export async function updateVideo(
  id: string,
  data: Partial<typeof video.$inferInsert>
): Promise<typeof video.$inferSelect | undefined> {
  const [result] = await db()
    .update(video)
    .set(data)
    .where(eq(video.id, id))
    .returning();
  return result;
}

/**
 * Get video by ID (only active videos)
 */
export async function getVideoById(
  id: string
): Promise<typeof video.$inferSelect | undefined> {
  const [result] = await db()
    .select()
    .from(video)
    .where(and(eq(video.id, id), eq(video.isDeleted, 0)))
    .limit(1);
  return result;
}

/**
 * Get video by ID (including deleted videos)
 */
export async function getVideoByIdIncludeDeleted(
  id: string
): Promise<typeof video.$inferSelect | undefined> {
  const [result] = await db()
    .select()
    .from(video)
    .where(eq(video.id, id))
    .limit(1);
  return result;
}

/**
 * Get videos by user ID with pagination
 */
export async function getVideosByUserId(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<(typeof video.$inferSelect)[]> {
  const data = await db()
    .select()
    .from(video)
    .where(and(eq(video.userId, userId), eq(video.isDeleted, 0)))
    .orderBy(desc(video.createdAt))
    .limit(limit)
    .offset(offset);
  return data;
}

/**
 * Get total count of videos by user ID
 */
export async function getVideoCountByUserId(userId: string): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(video)
    .where(and(eq(video.userId, userId), eq(video.isDeleted, 0)));
  return result.count;
}

/**
 * Get video by Replicate prediction ID
 */
export async function getVideoByPredictionId(
  predictionId: string
): Promise<typeof video.$inferSelect | undefined> {
  const [result] = await db()
    .select()
    .from(video)
    .where(eq(video.replicatePredictionId, predictionId))
    .limit(1);
  return result;
}

/**
 * Get videos by status
 */
export async function getVideosByStatus(
  status: string,
  limit: number = 100
): Promise<(typeof video.$inferSelect)[]> {
  const data = await db()
    .select()
    .from(video)
    .where(and(eq(video.status, status), eq(video.isDeleted, 0)))
    .orderBy(desc(video.createdAt))
    .limit(limit);
  return data;
}

/**
 * Soft delete video by ID
 */
export async function softDeleteVideo(
  id: string
): Promise<typeof video.$inferSelect | undefined> {
  const [result] = await db()
    .update(video)
    .set({ isDeleted: 1, updatedAt: new Date() })
    .where(eq(video.id, id))
    .returning();
  return result;
}

/**
 * Hard delete video by ID
 */
export async function deleteVideo(
  id: string
): Promise<typeof video.$inferSelect | undefined> {
  const [result] = await db()
    .delete(video)
    .where(eq(video.id, id))
    .returning();
  return result;
}

/**
 * Get total count of videos for a user
 */
export async function getUserVideosCount(userId: string): Promise<number> {
  const total = await db().$count(
    video,
    and(eq(video.userId, userId), eq(video.isDeleted, 0))
  );
  return total;
}

/**
 * Get total count of videos by status
 */
export async function getVideosByStatusCount(status: string): Promise<number> {
  const total = await db().$count(
    video,
    and(eq(video.status, status), eq(video.isDeleted, 0))
  );
  return total;
}
