"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { PostCard } from "../blog/post-card";
import { SectionHeading } from "../shared/section-heading";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, limit, orderBy, query } from "firebase/firestore";

export default function BlogPreview() {
  const firestore = useFirestore();
  const blogPostsQuery = useMemoFirebase(() => firestore && query(collection(firestore, "blogPosts"), orderBy("publicationDate", "desc"), limit(3)), [firestore]);
  const { data: latestPosts, isLoading } = useCollection(blogPostsQuery);

  return (
    <section id="blog" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="From the Blog"
          subtitle="Explore my latest articles and tutorials on Flutter development, best practices, and industry trends."
          className="mb-12"
        />
        {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {latestPosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/blog">
              Visit Blog <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
