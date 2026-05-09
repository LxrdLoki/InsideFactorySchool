export async function getPost(prisma: any, postId: number) {

  const post = await prisma.forumPost.findUnique({
    where: {
      id: postId
    },

    include: {
      user: {
        select: {
          username: true,
          role: true
        }
      },

      comments: {
        include: {
          user: {
            select: {
              username: true,
              role: true
            }
          }
        },

        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

  return post;
}
