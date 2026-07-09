"use client";

import { useActionState, useEffect, useState } from "react";
import { submitReview } from "../actions";
import Link from "next/link";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-yellow-500/25 transition-all flex items-center justify-center text-lg disabled:opacity-50"
    >
      <i className="bi bi-send-fill mr-2"></i> 
      {pending ? 'Submitting...' : 'Submit Feedback'}
    </button>
  );
}

export default function LeaveReviewPage() {
  const [state, formAction] = useActionState(submitReview, null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (state?.success) {
      alert("Thank you for your feedback! We appreciate it.");
      window.location.href = '/portal/status';
    }
  }, [state]);

  return (
    <div className="flex justify-center mt-8 px-4 animate-fade-in">
      <div className="w-full max-w-lg">
        <div className="mb-4">
          <Link href="/portal/status" className="text-blue-400 hover:text-blue-300 font-medium flex items-center transition-colors">
            <i className="bi bi-arrow-left mr-2"></i> Back to Dashboard
          </Link>
        </div>

        <div className="glass-card shadow-2xl p-8 border border-white/10">
          <div className="mb-8 text-center">
            <i className="bi bi-star-half text-5xl text-yellow-500 mb-4 block"></i>
            <h2 className="text-2xl font-bold text-white mb-2">Rate Our Service</h2>
            <p className="text-gray-400 text-sm">How was your recent visit? Let us know so we can improve!</p>
          </div>

          {state?.error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-md mb-6 text-sm flex items-center">
              <i className="bi bi-exclamation-triangle-fill mr-2"></i> {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="rating" value={rating} />
            
            <div className="text-center">
              <label className="block text-gray-400 font-semibold mb-4">Select Rating</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <i className={`bi ${star <= rating ? 'bi-star-fill text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]' : 'bi-star text-gray-600'}`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-semibold mb-2">Any Comments or Complaints?</label>
              <textarea 
                name="comment"
                placeholder="Tell us what you loved, or what we can do better..." 
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-yellow-500 transition-all placeholder-gray-500"
              ></textarea>
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
