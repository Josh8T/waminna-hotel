import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  roomId: number;
  onSuccess?: (review: { rating: number; comment: string; date: string }) => void;
}

export default function ReviewModal({ isOpen, onClose, roomName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a short review comment.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Thank you! Your review has been submitted.');
      if (onSuccess) {
        onSuccess({
          rating,
          comment,
          date: new Date().toISOString().split('T')[0],
        });
      }
      onClose();
      setComment('');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-warm-border relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-serif font-semibold text-[#1a1917]">
          Leave a Review
        </h3>
        <p className="text-xs text-[#8a8984] mt-1">
          Share your experience for <span className="font-medium text-[#1a1917]">{roomName}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Star Rating Select */}
          <div>
            <label className="block text-xs font-medium text-[#1a1917] mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-[#5c5a54] ml-2">
                {hoverRating || rating} / 5
              </span>
            </div>
          </div>

          {/* Comment Text Area */}
          <div>
            <label className="block text-xs font-medium text-[#1a1917] mb-1.5">
              Your Review & Comments
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you enjoy about your stay? Comfort, cleanliness, service..."
              className="w-full px-3.5 py-2.5 text-sm border border-warm-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5c5a54] hover:bg-warm-secondary rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
