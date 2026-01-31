"use client";

import { PostCard } from "@/components/blog/post-card";
import { SectionHeading } from "@/components/shared/section-heading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, orderBy, query } from "firebase/firestore";

export default function BlogPage() {
  const firestore = useFirestore();
  const blogPostsQuery = useMemoFirebase(() => firestore && query(collection(firestore, "blogPosts"), orderBy("publicationDate", "desc")), [firestore]);
  const { data: blogPosts, isLoading } = useCollection(blogPostsQuery);

  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </Button>
        <SectionHeading
          title="My Blog"
          subtitle="Sharing my journey and insights on Flutter, mobile development, and the tech world. Stay tuned for regular updates and deep dives."
          className="mb-12"
        />
        {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
