import {getBlogPostBySlug, getRelatedPosts} from "@/lib/blog-data"
import {Calendar, Clock, ArrowLeft} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {notFound} from "next/navigation"
import {Header} from "@/features/landingPage/components/header";
import {Footer} from "@/features/landingPage/components/footer";
import {BlogCard} from "@/features/landingPage/blog/components/blog-card";
import Link from "next/link";

export default async function BlogPostPage({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params
    const post = getBlogPostBySlug(slug)

    if (!post) {
        notFound()
    }

    const relatedPosts = getRelatedPosts(post.slug, 3)

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>

            {/* Article Hero */}
            <article className="flex-1">
                <div className="bg-gradient-to-b from-primary/5 to-background py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <Button variant="ghost" size="sm" asChild className="mb-6">
                                <Link href={'/blog'} className="gap-2">
                                    <ArrowLeft className="h-4 w-4"/>
                                    Späť na blog
                                </Link>
                            </Button>

                            <Badge variant="secondary" className="mb-4">
                                {post.category}
                            </Badge>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{post.title}</h1>

                            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                                <div className="flex items-center gap-3">
                                    {post.author.avatar ? (
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">
                                                {post.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium text-foreground">{post.author.name}</div>
                                        <div className="text-sm">{post.author.role}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4"/>
                                        <span className="text-sm">{post.publishedAt}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4"/>
                                        <span className="text-sm">{post.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="container mx-auto px-4 -mt-8 mb-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                            {post.image ? (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div
                                    className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <div className="text-6xl mb-4">📖</div>
                                        <div className="text-lg font-medium">{post.category}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="container mx-auto px-4 pb-16">
                    <div className="max-w-3xl mx-auto">
                        <div
                            className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
                            {post.content.split("\n\n").map((paragraph, index) => {
                                // Handle headings
                                if (paragraph.startsWith("## ")) {
                                    return (
                                        <h2 key={index} className="text-3xl mt-12 mb-6">
                                            {paragraph.replace("## ", "")}
                                        </h2>
                                    )
                                }
                                if (paragraph.startsWith("### ")) {
                                    return (
                                        <h3 key={index} className="text-2xl mt-8 mb-4">
                                            {paragraph.replace("### ", "")}
                                        </h3>
                                    )
                                }

                                // Handle lists
                                if (paragraph.includes("\n- ")) {
                                    const items = paragraph.split("\n").filter((line) => line.startsWith("- "))
                                    return (
                                        <ul key={index} className="my-6 space-y-2">
                                            {items.map((item, i) => (
                                                <li key={i}>{item.replace("- ", "")}</li>
                                            ))}
                                        </ul>
                                    )
                                }

                                // Handle numbered lists
                                if (paragraph.match(/^\d+\./)) {
                                    const items = paragraph.split("\n").filter((line) => line.match(/^\d+\./))
                                    return (
                                        <ol key={index} className="my-6 space-y-2">
                                            {items.map((item, i) => (
                                                <li key={i}>{item.replace(/^\d+\.\s*/, "")}</li>
                                            ))}
                                        </ol>
                                    )
                                }

                                // Handle special callouts
                                if (paragraph.startsWith("⚠️")) {
                                    return (
                                        <div key={index}
                                             className="my-8 p-6 bg-destructive/10 border-l-4 border-destructive rounded-r-lg">
                                            <p className="font-semibold text-foreground">{paragraph}</p>
                                        </div>
                                    )
                                }

                                if (paragraph.startsWith("✅")) {
                                    return (
                                        <div key={index}
                                             className="my-8 p-6 bg-primary/10 border-l-4 border-primary rounded-r-lg">
                                            <p className="font-semibold text-foreground">{paragraph}</p>
                                        </div>
                                    )
                                }

                                if (paragraph.startsWith("🚫")) {
                                    return (
                                        <div key={index}
                                             className="my-8 p-6 bg-muted border-l-4 border-muted-foreground rounded-r-lg">
                                            <p className="font-semibold text-foreground">{paragraph}</p>
                                        </div>
                                    )
                                }

                                // Handle code blocks
                                if (paragraph.startsWith("```")) {
                                    const code = paragraph.replace(/```/g, "").trim()
                                    return (
                                        <pre key={index} className="my-6 p-4 bg-muted rounded-lg overflow-x-auto">
                      <code className="text-sm">{code}</code>
                    </pre>
                                    )
                                }

                                // Regular paragraphs
                                if (paragraph.trim()) {
                                    return (
                                        <p key={index} className="my-6 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    )
                                }

                                return null
                            })}
                        </div>

                        {/* CTA Section */}
                        <div
                            className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl text-center">
                            <h3 className="text-2xl font-bold mb-4">Pripravení začať?</h3>
                            <p className="text-muted-foreground mb-6 text-pretty">
                                Vyskúšajte našu aplikáciu Denník jázd zadarmo a uvidíte, ako jednoduché môže byť vedenie
                                knihy jázd.
                            </p>
                            <Button size="lg" className="gap-2">
                                <Link href={'/register'}>
                                    Vyskúšať zadarmo
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="bg-muted/30 py-16">
                        <div className="container mx-auto px-4">
                            <div className="max-w-6xl mx-auto">
                                <h2 className="text-3xl font-bold mb-8 text-center">Podobné články</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {relatedPosts.map((relatedPost) => (
                                        <BlogCard key={relatedPost.slug} post={relatedPost}/>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </article>

            <Footer/>
        </div>
    )
}
