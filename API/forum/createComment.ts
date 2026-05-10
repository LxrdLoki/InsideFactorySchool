export async function createComment(
  body: any,
  prisma: any,
  userId: number,
  postId: number
) {

  const { text } = body;

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
