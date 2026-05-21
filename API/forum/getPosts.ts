export async function getPosts(prisma: any, subject?: string) {

  const posts = await prisma.forumPost.findMany({
    where: subject
      ? {
        subject: subject as any
      }
      : {},

    include: {
      user: {
        select: {
          username: true,
          role: true
        }
      },

      _count: {
        select: {
          comments: true
        }
      }
    },

    orderBy: [
      {
        upvotes: "desc"
      },
      {
        downvotes: "asc"
      }
    ]
  });

  return posts;
}
