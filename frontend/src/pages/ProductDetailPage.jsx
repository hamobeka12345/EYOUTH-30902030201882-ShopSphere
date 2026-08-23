import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/cartService';
import { getReviews, createReview } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [quantity, setQuantity] = useState(1);
  const [addToCartMsg, setAddToCartMsg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsStatus, setReviewsStatus] = useState('loading');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    setStatus('loading');
    getProduct(id)
      .then((res) => {
        setProduct(res.data.product);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setReviewsStatus('loading');
    getReviews(id)
      .then((res) => {
        setReviews(Array.isArray(res.data) ? res.data : []);
        setReviewsStatus('loaded');
      })
      .catch(() => {
        setReviews([]);
        setReviewsStatus('error');
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      setAddToCartMsg('Added to cart');
      setTimeout(() => setAddToCartMsg(''), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to cart');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await createReview(id, {
        userId: Number(user.id),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });
      const newReview = res.data?.review || {
        id: Date.now(),
        productId: Number(id),
        userId: Number(user.id),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        createdAt: new Date().toISOString()
      };
      setReviews((prev) => [newReview, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      setReviewMsg('Review added');
      setTimeout(() => setReviewMsg(''), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add review');
    }
  };

  if (status === 'loading') return <p className="loading" style={{ padding: '1.5rem' }}>Loading...</p>;
  if (status === 'error' || !product) return <p className="notice" style={{ padding: '1.5rem' }}>Product not found.</p>;

  return (
    <div className="product-detail">
      {product.image && (
        <img src={product.image} alt={product.name} />
      )}
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        {product.category?.name && <p className="product-detail-category">Category: {product.category.name}</p>}
        <p className="product-detail-price">${Number(product.price).toFixed(2)}</p>
        <p className="product-detail-desc">{product.description}</p>
        <div className="product-detail-actions">
          <label>
            Quantity:{' '}
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
          </label>
          <button onClick={handleAddToCart}>Add to cart</button>
        </div>

        {addToCartMsg && (
          <p className="notice" style={{ marginTop: 12 }}>{addToCartMsg}</p>
        )}

        <section style={{ marginTop: 32 }}>
          <h2>Reviews</h2>
          {reviewsStatus === 'loading' && <p>Loading reviews...</p>}
          {reviewsStatus === 'error' && <p className="notice">Could not load reviews.</p>}
          {reviews.length === 0 && reviewsStatus === 'loaded' && <p>No reviews yet.</p>}
          <ul>
            {reviews.map((r) => (
              <li key={r.id} style={{ marginBottom: 12 }}>
                <strong>Rating: {r.rating}/5</strong>
                <p>{r.comment}</p>
                <small>{new Date(r.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>

          {user && (
            <form className="form-stack" onSubmit={handleSubmitReview} style={{ marginTop: 24 }}>
              <h3>Add a review</h3>
              <label>
                Rating
                <select
                  className="field"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                >
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </label>
              <textarea
                className="field"
                rows="3"
                placeholder="Write a review"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
              <button className="btn" type="submit">Submit review</button>
              {reviewMsg && <p className="notice">{reviewMsg}</p>}
            </form>
          )}
        </section>

        <p className="product-detail-back">
          <Link to="/products" className="btn back-to-products">Back to products</Link>
        </p>
      </div>
    </div>
  );
}
