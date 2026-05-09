export async function deletePost(prisma: any, postId: number, user: any) {

  const post = await prisma.forumPost.findUnique({
    where: {
      id: postId
    }
  });

  if (!post) {
    return { error: "Post not found" };
  }

  const isOwner = post.userId === user.userId;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return { error: "Forbidden", status: 403 };
  }

  await prisma.forumPost.delete({
    where: {
      id: postId
    }
  });

  return { success: true };
}
