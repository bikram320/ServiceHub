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
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
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
        } else {
            setStats({
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            });
        }
    }, [reviews]);

    // Fetch reviews from backend
    useEffect(() => {
        const fetchReviews = async () => {
            if (!technicianId) return;

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/technicians/${technicianId}/reviews`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authorization header if needed
                        // 'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch reviews: ${response.status}`);
                }

                const data = await response.json();
                setReviews(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError('Failed to load reviews. Please try again later.');
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [technicianId]);

    // Submit review to backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !reviewText.trim()) return;

        setSubmitting(true);
        setSubmitError(null);

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
                headers: {
                    "Content-Type": "application/json",
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newReview),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to submit review: ${response.status}`);
            }

            const savedReview = await response.json();

            // Add the new review to the beginning of the list
            setReviews([savedReview, ...reviews]);

            // Reset form
            setRating(0);
            setReviewText("");
            setHoveredStar(0);
        } catch (error) {
            console.error('Error submitting review:', error);
            setSubmitError(error.message || 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Create a filled star component
    const StarFill = ({ size = 20 }) => (
        <Star size={size} fill="currentColor" />
    );

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
                    aria-label={interactive ? `Rate ${i} star${i !== 1 ? 's' : ''}` : undefined}
                >
                    {isFilled ? <StarFill size={20} /> : <Star size={20} />}
                </button>
            );
        }
        return stars;
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="technician-profile">
                <div className="loading-spinner">Loading reviews...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="technician-profile">
                <div className="error-message">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-button"
                    >
                        Retry
                    </button>
                </div>
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
                            <span className="rating-number">
                                {stats.totalReviews > 0 ? stats.averageRating : '0.0'}
                            </span>
                            <div className="stars-display">
                                {renderStars(Math.floor(parseFloat(stats.averageRating)))}
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
                                                width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[star] / stats.totalReviews) * 100 : 0}%`
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
                            <div key={review.id || index} className="review-card">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">
                                            <User size={18} />
                                        </div>
                                        <div className="reviewer-details">
                                            <span className="reviewer-name">
                                                {review.userName || 'Anonymous'}
                                            </span>
                                            <div className="review-meta">
                                                <div className="review-stars">
                                                    {renderStars(parseInt(review.rating))}
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

                    {submitError && (
                        <div className="error-message">
                            <p>{submitError}</p>
                        </div>
                    )}

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
                                maxLength="500"
                                disabled={submitting}
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
}

export default RatingReviews;