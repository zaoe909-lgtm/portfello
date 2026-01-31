import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function PostCard({ post }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/blog/${post.slug}`} className="block aspect-video relative">
          <Image
            src={post.imageUrl || `https://picsum.photos/seed/${post.id}/600/400`}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.imageHint || "technology abstract"}
          />
        </Link>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        <Badge variant="secondary" className="mb-2">
            <Calendar className="h-3 w-3 mr-1.5" />
            {new Date(post.publicationDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
        </Badge>
        <h3 className="text-xl font-bold font-headline mb-2 leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0 h-auto">
          <Link href={`/blog/${post.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
