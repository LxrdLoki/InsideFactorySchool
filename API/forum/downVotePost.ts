export async function downVotePost(prisma: any, postId: number, userId: number) {
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
      if (existingVote.value === -1) {
        // User already downvoted, remove the downvote
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
      } else if (existingVote.value === 1) {
        // User previously upvoted, change to downvote
        await prisma.forumPostVote.update({
          where: {
            userId_postId: {
              userId,
              postId
            }
          },
          data: {
            value: -1
          }
        });

        updatedPost = await prisma.forumPost.update({
          where: { id: postId },
          data: {
            downvotes: {
              increment: 1
            },
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
      }
    } else {
      // First time voting, create downvote
      await prisma.forumPostVote.create({
        data: {
          value: -1,
          userId,
          postId
        }
      });

      updatedPost = await prisma.forumPost.update({
        where: { id: postId },
        data: {
          downvotes: {
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
    console.error("error downvoting post -> ", error);
    return { error: "Failed to vote on post. Please try again." };
  }
}
