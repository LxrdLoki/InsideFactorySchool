import { sanitizeString } from "../helpers/scrapeDataValidator";

export async function createComment(
  body: any,
  prisma: any,
  userId: number,
  postId: number
) {

  const { rawText } = body;
  const text = sanitizeString(rawText);

  if (!text) {
    return { error: "Comment cannot be empty" };
  }

  const comment = await prisma.forumComment.create({
    data: {
      text,
      userId,
      postId
    },

    include: {
      user: {
        select: {
          username: true,
          role: true
        }
      }
    }
  });

  return comment;
}
