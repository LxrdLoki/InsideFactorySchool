import { sanitizeString } from "../helpers/scrapeDataValidator";

export async function createComment(
  body: any,
  prisma: any,
  userId: number,
  postId: number
) {

  const { text } = body;
  const sanitizedText = sanitizeString(text);

  if (!sanitizedText) {
    return { error: "Comment cannot be empty" };
  }

  const comment = await prisma.forumComment.create({
    data: {
      text: sanitizedText,
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
