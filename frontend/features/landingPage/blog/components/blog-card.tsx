import {Clock, Calendar} from "lucide-react"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import type {BlogPost} from "@/lib/blog-data"

interface BlogCardProps {
    post: BlogPost
    featured?: boolean
}

export function BlogCard({post, featured = false}: BlogCardProps) {
    return (
        <a href={`/blog/${post.slug}`} className="group">
            <Card className={`overflow-hidden transition-all hover:shadow-lg ${featured ? "md:col-span-2" : ""}`}>
                <div className="relative aspect-video overflow-hidden">
                    {post.image ? (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-transform group-hover:scale-105">
                            <div className="text-center text-muted-foreground">
                                <div className="text-4xl mb-2">📖</div>
                                <div className="text-sm font-medium">{post.category}</div>
                            </div>
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                            {post.category}
                        </Badge>
                    </div>
                </div>
                <CardHeader>
                    <h3
                        className={`font-bold text-balance group-hover:text-primary transition-colors ${featured ? "text-2xl" : "text-xl"}`}
                    >
                        {post.title}
                    </h3>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-pretty">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4"/>
                            <span>{post.publishedAt}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4"/>
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </a>
    )
}