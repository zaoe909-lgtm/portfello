"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useDoc, doc } from "firebase/firestore";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const personalInfoRef = useMemoFirebase(() => firestore && doc(firestore, "personalInfo", "main"), [firestore]);
  const { data: personalInfo } = useDoc(personalInfoRef);
  
  const blogPostQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'blogPosts'), where('slug', '==', slug));
  }, [firestore, slug]);

  const { data: posts, isLoading } = useCollection(blogPostQuery);
  const post = posts?.[0];

  if (isLoading || !post) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  const readingTime = Math.ceil(post.content.split(" ").length / 200);
  const authorName = personalInfo?.name || "Author";

  return (
    <div className="bg-background text-foreground">
      <header className="py-20 md:py-32 relative">
        <div className="absolute inset-0">
          <Image
            src={post.imageUrl || `https://picsum.photos/seed/${post.id}/1200/800`}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.imageHint || "technology abstract"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold font-headline mb-4 text-primary-foreground">
              {post.title}
            </h1>
            <div className="flex justify-center items-center gap-x-6 gap-y-2 text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <MarkdownRenderer content={post.content} />
        </div>
        <div className="text-center mt-12">
            <Button asChild>
                <Link href="/blog">
                    Back to Blog
                </Link>
            </Button>
        </div>
      </article>
    </div>
  );
}
