"use client"

import {getBlogPosts, getFeaturedPosts} from "@/lib/blog-data"
import {BookOpen} from "lucide-react"
import {useState, useMemo} from "react"
import {Header} from "@/features/landingPage/components/header";
import {Footer} from "@/features/landingPage/components/footer";
import {BlogCard} from "@/features/landingPage/blog/components/blog-card";
import {BlogCategories} from "@/features/landingPage/blog/components/blog-categories";
import {BlogFilters} from "@/features/landingPage/blog/components/blog-filters";
import {APP_CONFIG} from "@/config/app";

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState("Všetky")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest")

    const allPosts = getBlogPosts()
    const featuredPosts = getFeaturedPosts()

    const filteredPosts = useMemo(() => {
        let posts = selectedCategory === "Všetky" ? allPosts : allPosts.filter((post) => post.category === selectedCategory)

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            posts = posts.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.excerpt.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query) ||
                    post.author.name.toLowerCase().includes(query),
            )
        }

        // Sort
        posts = [...posts].sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                case "oldest":
                    return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
                case "title-asc":
                    return a.title.localeCompare(b.title, "sk")
                case "title-desc":
                    return b.title.localeCompare(a.title, "sk")
                case "reading-time":
                    const aTime = Number.parseInt(a.readTime)
                    const bTime = Number.parseInt(b.readTime)
                    return aTime - bTime
                default:
                    return 0
            }
        })

        return posts
    }, [allPosts, selectedCategory, searchQuery, sortBy])

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/5 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                            <BookOpen className="w-8 h-8 text-primary"/>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Blog {APP_CONFIG.name}</h1>
                        <p className="text-xl text-muted-foreground text-pretty">
                            Všetko o elektronickej knihe jázd, legislatíve, DPH a praktických tipoch pre podnikateľov
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Posts */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Odporúčané články</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {featuredPosts.map((post) => (
                            <BlogCard key={post.slug} post={post} featured/>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Posts */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-6 text-center">Všetky články</h2>
                            <BlogCategories onCategoryChange={setSelectedCategory}/>
                        </div>

                        <BlogFilters
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />

                        {(searchQuery || selectedCategory !== "Všetky") && (
                            <div className="mb-6 text-muted-foreground">
                                Nájdených {filteredPosts.length}{" "}
                                {filteredPosts.length === 1 ? "článok" : filteredPosts.length < 5 ? "články" : "článkov"}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map((post) => (
                                <BlogCard key={post.slug} post={post}/>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">
                                    {searchQuery ? `Nenašli sa žiadne výsledky pre "${searchQuery}"` : "Žiadne články v tejto kategórii"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer/>
        </div>
    )
}
