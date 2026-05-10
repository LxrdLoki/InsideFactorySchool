export async function deleteComment(prisma: any, commentId: number, user: any) {

  const comment = await prisma.forumComment.findUnique({
    where: {
      id: commentId
    }
  });

  if (!comment) {
    return { error: "Comment not found" };
  }

  const isOwner = comment.userId === user.userId;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return { error: "Forbidden", status: 403 };
  }

  await prisma.forumComment.delete({
    where: {
      id: commentId
    }
  });

  return { success: true };
}
