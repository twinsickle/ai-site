'use client';

import React, { useState } from 'react';
import { Reservation } from '@/lib/products';
import { Calendar, User, Mail, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReservationFormProps {
  reservation: Reservation;
  onBack: () => void;
  onComplete: () => void;
}

export default function ReservationForm({ reservation, onBack, onComplete }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      setTimeout(onComplete, 3000);
    }, 1500);
  };

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4">Reservation Confirmed!</h2>
        <p className="text-zinc-400 text-lg max-w-md">
          Thank you, {formData.name}. Your reservation for the {reservation.product.name} has been received. 
          We'll contact you at {formData.email} shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2 transition group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Configuration
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Summary Card */}
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl h-fit">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <Calendar className="text-blue-500" />
            Reservation Summary
          </h3>
          
          <div className="flex gap-4 mb-6 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
            <img 
              src={reservation.product.imageUrl} 
              alt={reservation.product.name} 
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div>
              <h4 className="font-bold text-zinc-100">{reservation.product.name}</h4>
              <p className="text-blue-400 font-bold">${reservation.product.price}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Selected Configuration</h5>
            {Object.entries(reservation.config).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                <span className="text-zinc-400">{key}</span>
                <span className="text-zinc-100 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
          <h3 className="text-2xl font-black mb-6">Your Details</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 ml-1">Additional Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition min-h-[100px]"
                placeholder="Any special requests?"
              />
            </div>

            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-900/40 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
            </button>
            <p className="text-[10px] text-center text-zinc-600 font-bold uppercase tracking-widest">
              No payment required. We will hold this item for 48 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
