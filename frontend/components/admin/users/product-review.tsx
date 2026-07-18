'use client'

import { useState, useEffect, useMemo } from 'react'
import { Star, CheckCircle, ThumbsUp, MessageSquare, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Review } from '@/types'

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  // --- STATE MATRIX ---
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<number>(5)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({})
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false)

  // --- INITIAL HYDRATION ---
  useEffect(() => {
    const stored = localStorage.getItem(`product_reviews`)
    if (stored) {
      setReviews(JSON.parse(stored))
    } else {
        setReviews([]);
    }
  }, [productId])

  // --- CALCULATIONS & DISTRIBUTIONS ---
  const stats = useMemo(() => {
    if (reviews.length === 0) return { total: 0, average: 0, distribution: [0, 0, 0, 0, 0] }
    
    const total = reviews.length
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    const average = Math.round((sum / total) * 10) / 10
    
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating - 1]++
      }
    })

    return { total, average, distribution: distribution.reverse() }
  }, [reviews])

  // --- ACTIONS ---
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !title.trim() || !content.trim()) return

    const newReview: Review = {
      id: crypto.randomUUID(),
      productId,
      author,
      rating,
      title,
      content,
      helpful: 0,
      createdAt: Date.now(),
      verified: true
    }

    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem(`product_reviews`, JSON.stringify(updated))

    // Reset Submission Fields
    setAuthor('')
    setTitle('')
    setContent('')
    setRating(5)
    setIsMobileFormOpen(false)
  }

  const handleHelpfulClick = (reviewId: string) => {
    if (hasVoted[reviewId]) return

    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return { ...r, helpful: r.helpful + 1 }
      }
      return r
    })

    setReviews(updated)
    localStorage.setItem(`product_reviews`, JSON.stringify(updated))
    setHasVoted(prev => ({ ...prev, [reviewId]: true }))
  }

  return (
    <div className="bg-white py-12 sm:py-16 md:py-20 border-t border-neutral-100 text-neutral-900 antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-16">
        
        {/* Section Title & Header Control */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-neutral-950">
            Client Reviews <span className="font-serif italic text-neutral-400">({reviews.length})</span>
          </h2>
          {/* Quick-action Mobile Add Review trigger */}
          <button
            onClick={() => setIsMobileFormOpen(!isMobileFormOpen)}
            className="md:hidden inline-flex items-center gap-2 text-xs font-light tracking-wider uppercase border border-neutral-900 bg-transparent px-4 py-2.5 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors self-start xs:self-auto"
          >
            {isMobileFormOpen ? <X size={14} /> : <Plus size={14} />}
            {isMobileFormOpen ? 'Close Panel' : 'Write Review'}
          </button>
        </div>

        {/* Master Fluid Layout System */}
        <div className="grid gap-8 sm:gap-12 md:gap-10 lg:gap-16 grid-cols-1 md:grid-cols-12 items-start">
          
          {/* LEFT CONTAINER: Statistics Matrix & Interactive Input Forms */}
          <div className={`md:col-span-5 lg:col-span-4 space-y-6 sm:space-y-8 ${isMobileFormOpen ? 'block' : 'hidden md:block'}`}>
            
            {/* Scorecard Component Container */}
            <div className="bg-neutral-50 border border-neutral-100 p-5 sm:p-6 lg:p-8 rounded-none">
              <div className="flex flex-row items-center md:items-baseline gap-4">
                <span className="font-serif text-4xl sm:text-5xl font-light tracking-tighter">{stats.average || '0.0'}</span>
                <div className="space-y-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${s <= Math.round(stats.average) ? 'fill-neutral-900 stroke-neutral-900' : 'text-neutral-200'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-[11px] sm:text-xs font-light text-neutral-400">Based on {stats.total} entries</p>
                </div>
              </div>

              {/* Graphical Percentage Bars Breakdown */}
              <div className="mt-6 sm:mt-8 space-y-2.5">
                {stats.distribution.map((count, idx) => {
                  const starVal = 5 - idx
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                  return (
                    <div key={starVal} className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-light text-neutral-500">
                      <span className="w-3 font-mono text-neutral-400">{starVal}</span>
                      <div className="flex-1 bg-neutral-200/60 h-[3px] rounded-none overflow-hidden">
                        <div 
                          className="bg-neutral-900 h-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-6 text-right font-mono text-neutral-400">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Input Submission Canvas */}
            <div className="border border-neutral-100 p-5 sm:p-6 lg:p-8 bg-white">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-800 mb-4 sm:mb-6">Write an Appraisal</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-800 block">Your Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = hoveredRating !== null ? star <= hoveredRating : star <= rating
                      return (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(null)}
                          className="p-0.5 transition-transform duration-100 hover:scale-110 focus:outline-none"
                        >
                          <Star 
                            className={`w-[18px] h-[18px] sm:w-5 sm:h-5 transition-colors duration-100 ${
                              active ? 'fill-neutral-900 stroke-neutral-900' : 'text-neutral-200 stroke-[1.25]'
                            }`} 
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-800">Signature</label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g., Sarah M."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="rounded-none border-neutral-200 focus-visible:border-neutral-900 bg-white placeholder:text-neutral-400 h-10 shadow-none text-xs sm:text-sm font-light"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-800">Review Header</label>
                  <Input
                    type="text"
                    required
                    placeholder="Summarize your experience"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-none border-neutral-200 focus-visible:border-neutral-900 bg-white placeholder:text-neutral-400 h-10 shadow-none text-xs sm:text-sm font-light"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-medium uppercase tracking-wider text-neutral-800">Detailed Review</label>
                  <textarea
                    required
                    placeholder="Share the finer details regarding cut, fabric, and layout quality..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-24 w-full rounded-none border border-neutral-200 bg-white px-3 py-2 text-xs sm:text-sm font-light text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors shadow-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-none border border-neutral-900 bg-transparent text-neutral-900 font-light hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-none text-[11px] uppercase tracking-wider"
                >
                  Publish Review
                </Button>
              </form>
            </div>
          </div>

          <div className={`md:col-span-7 lg:col-span-8 space-y-6 sm:space-y-8 md:border-l md:border-neutral-100 md:pl-6 lg:pl-12 ${isMobileFormOpen ? 'hidden md:block' : 'block'}`}>
            {reviews.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {reviews.map((review) => (
                  <div key={review.id} className="py-6 sm:py-8 first:pt-0 last:pb-0 space-y-3">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-neutral-900 stroke-neutral-900' : 'text-neutral-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-neutral-950 whitespace-nowrap">{review.author}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium tracking-wide text-neutral-400 uppercase bg-neutral-50 px-1.5 py-0.5 border border-neutral-100">
                            <CheckCircle className="w-2.5 h-2.5 text-neutral-500 stroke-[2.5]" /> Verified
                          </span>
                        )}
                      </div>
                      
                      <span className="text-[11px] font-mono font-light text-neutral-400 self-start sm:self-auto">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-medium text-neutral-900">{review.title}</h4>
                      <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-500 max-w-full lg:max-w-2xl break-words">
                        {review.content}
                      </p>
                    </div>

                    <div className="pt-1.5 flex items-center">
                      <button
                        onClick={() => handleHelpfulClick(review.id)}
                        disabled={hasVoted[review.id]}
                        className={`inline-flex items-center gap-2 text-[11px] sm:text-xs font-light tracking-wide transition-colors ${
                          hasVoted[review.id] 
                            ? 'text-neutral-400 cursor-not-allowed' 
                            : 'text-neutral-500 hover:text-neutral-950'
                        }`}
                      >
                        <ThumbsUp className={`w-3 h-3 ${hasVoted[review.id] ? 'fill-neutral-300 stroke-neutral-300' : ''}`} />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 bg-neutral-50 border border-dashed border-neutral-200 px-4">
                <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-300 stroke-[1.25] mb-3" />
                <p className="font-serif text-base sm:text-lg font-light text-neutral-950">No reviews listed yet</p>
                <p className="mt-1 text-[11px] sm:text-xs font-light text-neutral-400 max-w-xs">
                  Be the first to leave feedback regarding layout configurations or texture quality.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}