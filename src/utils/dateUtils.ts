// utils/dateUtils.ts
export const formatRemainingTime = (deadline: string | null): string => {
  if (!deadline) return "";
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffInMs = deadlineDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return "Tenggat waktu terlewat";
  if (diffInDays === 0) return "Hari ini";
  if (diffInDays === 1) return "1 hari lagi";
  return `${diffInDays} hari lagi`;
};