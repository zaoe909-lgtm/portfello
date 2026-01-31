import BlogPostClient from "./BlogPostClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: 'index' }];
}

export default function BlogPostPage() {
  return <BlogPostClient />;
}
