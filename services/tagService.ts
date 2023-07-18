import { sanitizeTag, validateTag } from "@/validators/tagValidator";
import dbConnect from "../lib/dbConnect";
import Tags from "../models/tagsModel";

/**
 * Gets all tags from the database.
 *
 * @returns An array of sanitized and validated tag objects.
 * @throws Error if the tag array is not found or not an array.
 */
export async function getAllTagsFromDb(): Promise<any> {
  await dbConnect();

  const tags = await Tags.find({});
  if (!Array.isArray(tags)) throw new Error();

  const sanitizedTags = await Promise.all(tags.map(async (tag) => await validateTag(sanitizeTag(tag))));

  return sanitizedTags;
}
