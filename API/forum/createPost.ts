import { sanitizeString } from "../helpers/scrapeDataValidator";

export async function createPost(body: any, prisma: any, userId: number) {
  const { title, text, subject } = body;

  // sanitize user input to prevent storing XSS attacks in database
  const sanitizedTitle = sanitizeString(title);
  const sanitizedText = sanitizeString(text)


  if (!sanitizedTitle || !sanitizedText || !subject) {
    return { error: "Missing required fields" };
  }

  if (sanitizedTitle.length > 100) {
    return { error: "Title too long" };
  }

  if (sanitizedText.length > 5000) {
    return { error: "Post too long" };
  }

  // TODO: add typing for subject and validate it here

  try {
    const post = await prisma.forumPost.create({
      data: {
        title: sanitizedTitle,
        text: sanitizedText,
        subject,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    });

    return post;
  } catch (error: any) {
    console.error("error creating forum post -> ", error);
    return { error: "Failed to create post. Please try again." };
  }
}
