export async function upVotePost(prisma: any, postId: number, userId: number) {
  try {
    // Check if post exists
    const post = await prisma.forumPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return { error: "Post not found" };
    }

    // Check if user already voted on this post
    const existingVote = await prisma.forumPostVote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    let updatedPost;

    if (existingVote) {
      // User already voted, handle based on previous vote value
      if (existingVote.value === 1) {
        // User already upvoted, remove the upvote
        await prisma.forumPostVote.delete({
          where: {
            userId_postId: {
              userId,
              postId
            }
          }
        });

        updatedPost = await prisma.forumPost.update({
          where: { id: postId },
          data: {
            upvotes: {
              decrement: 1
            }
          },
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        });
      } else if (existingVote.value === -1) {
        // User previously downvoted, change to upvote
        await prisma.forumPostVote.update({
          where: {
            userId_postId: {
              userId,
              postId
            }
          },
          data: {
            value: 1
          }
        });

        updatedPost = await prisma.forumPost.update({
          where: { id: postId },
          data: {
            upvotes: {
              increment: 1
            },
            downvotes: {
              decrement: 1
            }
          },
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        });
      }
    } else {
      // First time voting, create upvote
      await prisma.forumPostVote.create({
        data: {
          value: 1,
          userId,
          postId
        }
      });

      updatedPost = await prisma.forumPost.update({
        where: { id: postId },
        data: {
          upvotes: {
            increment: 1
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });
    }

    return updatedPost;
  } catch (error: any) {
    console.error("error upvoting post -> ", error);
    return { error: "Failed to vote on post. Please try again." };
  }
}
