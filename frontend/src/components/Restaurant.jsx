import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRestaurant, getRestaurants } from "../redux/actions/restaurantAction";
import axios from "axios";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const [showAI, setShowAI] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const { isAuthenticated, user } = useSelector(
    (state) => state.user || {}
  );

  //DELETE
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${restaurant.name}"?`)) return;

    const result = await dispatch(deleteRestaurant(restaurant._id));
    if (deleteRestaurant.fulfilled.match(result)) {
      alert("Restaurant deleted successfully!");
      dispatch(getRestaurants()); // refresh lists and counts
    } else {
      alert(result.payload || "Failed to delete restaurant");
    }
  };

  // SUBMIT REVIEW
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/v1/ai/stores/${restaurant._id}/review`, {
        name: user?.name || "Anonymous User",
        rating: Number(newReview.rating),
        Comment: newReview.comment,
      }, { withCredentials: true });

      alert("Review added and AI analysis completed successfully!");
      setShowReviewModal(false);
      setNewReview({ rating: 5, comment: "" });
      dispatch(getRestaurants()); // refresh to get updated counts and AI summaries
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="col-12 my-3">
      <div className="card restaurant-card p-3">
        <Link to={`/eats/stores/${restaurant._id}/menus`}>
          <img
            className="restaurant-image"
            src={restaurant.images?.[0]?.url}
            alt={restaurant.name}
          />
        </Link>

        <div className="restaurant-info">
          <h4>{restaurant.name}</h4>

          <p className="rest_address">{restaurant.address}</p>

          <div className="ratings">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{
                  width: `${(restaurant.ratings / 5) * 100}%`,
                }}
              ></div>
            </div>

            <span>({restaurant.numOfReviews} Reviews)</span>
          </div>

          <div className="mt-3">
            {restaurant.reviewSentiment && (
              <button
                className="ai-btn"
                onClick={() => setShowAI(!showAI)}
              >
                {showAI ? "➖ Hide Summary" : "💬 View Review Summary"}
              </button>
            )}

            {isAuthenticated && user && (
              <button
                className="ai-btn ml-2"
                onClick={() => setShowReviewModal(true)}
                style={{ background: "#0056b3" }}
              >
                ✍️ Add Review
              </button>
            )}

            {isAuthenticated && user && user.role === "admin" && (
              <button
                className="ai-btn ml-2"
                onClick={handleDelete}
                style={{ background: "#dc3545" }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>

        {showAI && (
          <div className="ai-insights-box">
            <div className="ai-status">
              Review Summary : 😊 <strong>{restaurant.reviewSentiment}</strong>
            </div>

            <ul>
              {(restaurant.reviewSummaryBullets || []).map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>

            <div className="mentions">
              {(restaurant.reviewTopMentions || []).map((item, index) => (
                <span key={index} className="mention-tag">
                  #{item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD REVIEW MODAL */}
      {showReviewModal && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Add Review for {restaurant.name}</h3>
            <form onSubmit={submitReviewHandler}>
              <div className="form-group mt-3">
                <label>Rating</label>
                <select
                  className="form-control"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
                  required
                >
                  <option value="5">5 Stars - Excellent</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Good</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>

              <div className="form-group mt-3">
                <label>Comment</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  required
                  placeholder="Share details of your experience at this restaurant..."
                ></textarea>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary mr-2">
                  Submit Review
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;