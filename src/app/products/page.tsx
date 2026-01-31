"use client"

import { useState } from "react"
import { Search, Filter, Star, ShoppingCart, Eye, ChevronDown } from "lucide-react"
import { GlassCard } from "@/lib/components/glass-card"
import { GlassButton } from "@/lib/components/glass-button"
import { GlassInput } from "@/lib/components/glass-input"
import { GlassContainer } from "@/lib/components/glass-container"
import { GlassBadge } from "@/lib/components/glass-badge"

const categories = ["All", "UI Kits", "Templates", "Components", "Tools", "Resources"]
const products = [
  {
    id: 1,
    name: "Glassmorphism UI Kit",
    price: "$49",
    category: "UI Kits",
    rating: 4.9,
    reviews: 328,
    sales: 1250,
    image: "🎨",
    badge: "Featured",
  },
  {
    id: 2,
    name: "Modern Dashboard Template",
    price: "$29",
    category: "Templates",
    rating: 4.7,
    reviews: 192,
    sales: 856,
    image: "📊",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Advanced Component Library",
    price: "$79",
    category: "Components",
    rating: 4.8,
    reviews: 456,
    sales: 2100,
    image: "🧩",
    badge: "Premium",
  },
  {
    id: 4,
    name: "Design System Generator",
    price: "$99",
    category: "Tools",
    rating: 4.6,
    reviews: 234,
    sales: 567,
    image: "⚙️",
    badge: "New",
  },
  {
    id: 5,
    name: "Animation Pack",
    price: "$39",
    category: "Resources",
    rating: 4.8,
    reviews: 301,
    sales: 1089,
    image: "✨",
    badge: "Trending",
  },
  {
    id: 6,
    name: "Icon Collection Pro",
    price: "$24",
    category: "Resources",
    rating: 4.9,
    reviews: 512,
    sales: 3420,
    image: "🎯",
    badge: null,
  },
  {
    id: 7,
    name: "Color Palette Generator",
    price: "$19",
    category: "Tools",
    rating: 4.7,
    reviews: 287,
    sales: 945,
    image: "🎪",
    badge: null,
  },
  {
    id: 8,
    name: "Responsive Layout System",
    price: "$59",
    category: "Templates",
    rating: 4.8,
    reviews: 398,
    sales: 1567,
    image: "📱",
    badge: "Popular",
  },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Complex Gradient Background */}
      <div
        className="fixed inset-0 -z-10 transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(3, 0, 20, 0.8) 0%, #030014 50%, #020010 100%)'
        }}
      />
      <div
        className="fixed inset-0 -z-10 opacity-40 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
        }}
      />

      <main className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Explore Products
          </h1>
          <p className="text-white/70 text-lg">
            Discover our premium design assets and tools
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <GlassInput
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            blur={25}
            refraction={0.12}
            depth={3}
          />

          {/* Sort Dropdown */}
          <GlassContainer
            className="p-3 flex items-center gap-2 cursor-pointer group"
            blur={25}
            refraction={0.12}
            depth={3}
          >
            <Filter className="w-5 h-5 text-white/70" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white flex-1 focus:outline-none text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-4 h-4 text-white/70" />
          </GlassContainer>

          {/* View Toggle */}
          <div className="flex gap-2">
            <GlassButton variant="ghost" size="sm" blur={20} refraction={0.1} depth={2}>
              Grid View
            </GlassButton>
            <GlassButton variant="secondary" size="sm" blur={20} refraction={0.1} depth={2}>
              List View
            </GlassButton>
          </div>
        </div>

        {/* Category Filter Sidebar and Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlassContainer
              className="p-6 sticky top-6"
              blur={25}
              refraction={0.12}
              depth={4}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      selectedCategory === category
                        ? "bg-blue-500/40 text-white border border-blue-400/50"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">Price Range</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                    <input type="checkbox" className="w-4 h-4" />
                    Under $25
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                    <input type="checkbox" className="w-4 h-4" />
                    $25 - $50
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                    <input type="checkbox" className="w-4 h-4" />
                    $50 - $100
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                    <input type="checkbox" className="w-4 h-4" />
                    Over $100
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">Rating</h4>
                <div className="space-y-2 text-sm text-white/70">
                  {[5, 4, 3].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer hover:text-white">
                      <input type="checkbox" className="w-4 h-4" />
                      <div className="flex items-center gap-1">
                        {Array(rating).fill(0).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        & Up
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </GlassContainer>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <GlassCard
                    key={product.id}
                    variant="lg"
                    interactive
                    className="flex flex-col group"
                    blur={20}
                    refraction={0.12}
                    depth={3}
                  >
                    {/* Product Image */}
                    <div className="h-40 rounded-lg bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent flex items-center justify-center text-6xl relative overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                      {product.image}
                      {product.badge && (
                        <div className="absolute top-3 right-3">
                          <GlassBadge
                            variant={
                              product.badge === "Featured"
                                ? "blue"
                                : product.badge === "Premium"
                                ? "purple"
                                : "yellow"
                            }
                            blur={15}
                            refraction={0.15}
                            depth={2}
                          >
                            {product.badge}
                          </GlassBadge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">{product.name}</h3>
                          <p className="text-xs text-white/60">{product.category}</p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1">
                          {Array(Math.floor(product.rating)).fill(0).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-white/70">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="text-xs text-white/60 mb-4">
                        {product.sales.toLocaleString()} sales this month
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-2xl font-bold text-white">{product.price}</span>
                      <div className="flex gap-2">
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          blur={15}
                          refraction={0.1}
                          depth={2}
                          className="p-2"
                        >
                          <Eye className="w-4 h-4" />
                        </GlassButton>
                        <GlassButton
                          variant="primary"
                          size="sm"
                          blur={15}
                          refraction={0.1}
                          depth={2}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <GlassContainer
                className="p-12 text-center"
                blur={25}
                refraction={0.12}
                depth={4}
              >
                <p className="text-white/70 text-lg">
                  No products found matching your criteria.
                </p>
              </GlassContainer>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <GlassButton
                    key={page}
                    variant={page === 1 ? "primary" : "ghost"}
                    size="sm"
                    blur={15}
                    refraction={0.1}
                    depth={2}
                    className="w-10"
                  >
                    {page}
                  </GlassButton>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
