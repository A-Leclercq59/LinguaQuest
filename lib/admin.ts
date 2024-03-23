import { auth } from "@clerk/nextjs";

const allowedIds = ["user_2djL4ILw4LZEfB2t869uAHUR56p"];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return allowedIds.indexOf(userId) !== -1;
};
