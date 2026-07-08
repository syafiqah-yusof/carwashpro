"use client";

import { useState } from 'react';
import { uploadReceipt } from '../actions';
import Link from 'next/link';

export default function HistoryView({ history }: { history: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{type: 'error'|'success', text: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await uploadReceipt(null, formData);
      if (res?.error) {
        setMessage({ type: 'error', text: res.error });
      } else if (res?.success) {
        setMessage({ type: 'success', text: 'Receipt uploaded successfully! Awaiting verification.' });
        setTimeout(() => setIsModalOpen(false), 2000);
        // We'd typically refresh the page here to show the new pending item
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    }
    setIsPending(false);
  }

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/portal/status" className="text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
            <i className="bi bi-arrow-left mr-2"></i> Back
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all text-sm flex items-center"
          >
            <i className="bi bi-cloud-arrow-up-fill mr-2"></i> Upload Receipt
          </button>
        </div>

        <div className="glass-card shadow-2xl p-6 md:p-8 border border-white/10 animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            <i className="bi bi-clock-history mr-2 text-cyan-500"></i> Wash History
          </h2>

          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <i className="bi bi-journal-x text-5xl mb-3 block opacity-50"></i>
              <p>No wash history found.</p>
              <p className="text-sm mt-2">Upload a receipt to claim a wash!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={item.payment_id || idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="text-white font-bold text-lg mb-1">
                      {new Date(item.date_time).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.payment_method === 'Receipt Upload' ? 'Uploaded Receipt' : `Payment: RM ${item.amount}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {item.status === 'Pending Verification' ? (
                      <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <i className="bi bi-hourglass-split mr-1"></i> Pending
                      </span>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <i className="bi bi-check-circle-fill mr-1"></i> Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card shadow-2xl p-6 w-full max-w-md border border-white/10 relative animate-fade-in">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>
            
            <h3 className="text-xl font-bold text-white mb-4">Upload Wash Receipt</h3>
            
            {message && (
              <div className={`p-3 rounded-md mb-4 text-sm flex items-center ${
                message.type === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-green-500/20 border border-green-500/50 text-green-400'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors group cursor-pointer bg-gray-900/50">
                <i className="bi bi-image text-4xl text-gray-500 group-hover:text-cyan-500 transition-colors mb-2 block"></i>
                <label className="text-gray-300 font-semibold cursor-pointer text-sm block">
                  Select an image or take a photo
                  <input type="file" name="receiptFile" accept="image/*" className="hidden" required />
                </label>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 5MB</p>
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-lg disabled:opacity-50 mt-4"
              >
                {isPending ? 'Uploading...' : 'Submit Receipt'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
