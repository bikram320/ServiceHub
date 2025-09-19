import React, { useState, useEffect } from "react";
import { Star, User, Calendar, CheckCircle } from "lucide-react";
import "../../styles/RatingReviews.css";

function RatingReviews({ technicianId, user }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [hoveredStar, setHoveredStar] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });

    // Calculate stats when reviews change
    useEffect(() => {
        if (reviews.length > 0) {
            const total = reviews.length;
            const sum = reviews.reduce((acc, review) => acc + parseInt(review.rating), 0);
            const average = (sum / total).toFixed(1);

            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            reviews.forEach(review => {
                distribution[review.rating]++;
            });

            setStats({
                averageRating: average,
                totalReviews: total,
                ratingDistribution: distribution
            });
        }
    }, [reviews]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/technicians/${technicianId}/reviews`);
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (technicianId) {
            fetchReviews();
        }
    }, [technicianId]);

    // Submit review
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !reviewText.trim()) return;

        setSubmitting(true);
        try {
            const newReview = {
                technicianId,
                userId: user.id,
                rating: parseInt(rating),
                reviewText: reviewText.trim(),
                userName: user.name || 'Anonymous',
                date: new Date().toISOString()
            };

            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReview),
            });

            if (response.ok) {
                setReviews([newReview, ...reviews]);
                setRating(0);
                setReviewText("");
                setHoveredStar(0);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = interactive ? (hoveredStar >= i || (!hoveredStar && rating >= i)) : (rating >= i);
            stars.push(
                <button
                    key={i}
                    type="button"
                    className={`star ${interactive ? 'interactive' : ''} ${isFilled ? 'filled' : ''}`}
                    onClick={interactive ? () => setRating(i) : undefined}
                    onMouseEnter={interactive ? () => setHoveredStar(i) : undefined}
                    onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
                    disabled={!interactive}
                >
                    {isFilled ? <StarFill size={20} /> : <Star size={20} />}
                </button>
            );
        }
        return stars;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="technician-profile">
                <div className="loading-spinner">Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className="technician-profile">
            {/* Header Section */}
            <div className="reviews-header">
                <h2 className="section-title">Customer Reviews & Ratings</h2>

                {/* Rating Summary */}
                <div className="rating-summary">
                    <div className="overall-rating">
                        <div className="rating-display">
                            <span className="rating-number">{stats.averageRating}</span>
                            <div className="stars-display">
                                {renderStars(Math.floor(stats.averageRating))}
                            </div>
                        </div>
                        <p className="rating-text">
                            Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    {stats.totalReviews > 0 && (
                        <div className="rating-distribution">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="distribution-bar">
                                    <span className="star-label">{star}★</span>
                                    <div className="bar-container">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                width: `${(stats.ratingDistribution[star] / stats.totalReviews) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="count">({stats.ratingDistribution[star]})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews List */}
            <div className="reviews-section">
                <h3 className="reviews-title">All Reviews</h3>

                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <p>No reviews yet. Be the first to review this technician!</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">
                                            <User size={18} />
                                        </div>
                                        <div className="reviewer-details">
                                            <span className="reviewer-name">{review.userName || 'Anonymous'}</span>
                                            <div className="review-meta">
                                                <div className="review-stars">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="review-date">
                          <Calendar size={14} />
                                                    {formatDate(review.date)}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.verified && (
                                        <div className="verified-badge">
                                            <CheckCircle size={16} />
                                            <span>Verified</span>
                                        </div>
                                    )}
                                </div>
                                <div className="review-content">
                                    <p className="review-text">{review.reviewText}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Form */}
            {user?.role === "user" && (
                <div className="review-form-section">
                    <h3 className="form-title">Leave a Review</h3>
                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="form-group">
                            <label className="form-label">Your Rating *</label>
                            <div className="star-rating">
                                {renderStars(rating, true)}
                                <span className="rating-label">
                  {rating > 0 && `${rating} out of 5 stars`}
                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="reviewText">
                                Your Review *
                            </label>
                            <textarea
                                id="reviewText"
                                className="review-textarea"
                                placeholder="Share your experience with this technician. What did you like? How was the service quality?"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                required
                                rows="4"
                            />
                            <span className="char-count">
                {reviewText.length}/500 characters
              </span>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={!rating || !reviewText.trim() || submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RatingReviews;