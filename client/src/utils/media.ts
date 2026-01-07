import logo from "../assets/logo.jpg";

export const resolveImageUrl = (imageUrl?: string) => {
  const defaultImage = logo;
  if (!imageUrl) return defaultImage;
  if (imageUrl.startsWith("/uploads"))
    return `http://localhost:5000${imageUrl}`;
  return imageUrl;
};
