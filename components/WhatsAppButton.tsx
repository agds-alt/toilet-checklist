// ============================================
// components/WhatsAppButton.tsx
// ============================================
'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function WhatsAppButton() {
    const [showTooltip, setShowTooltip] = useState(false);
    const phoneNumber = '+6287874415491';
    const message = 'Halo, saya ingin bertanya mengenai sistem Toilet Checklist...';

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {showTooltip && (
                <div className="absolute bottom-full right-0 mb-3 glass-card rounded-2xl px-4 py-3 shadow-2xl bg-white/95 backdrop-blur-xl border border-slate-200 min-w-[240px]">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="font-bold text-slate-800 text-sm mb-1">Need Help?</p>
                            <p className="text-xs text-slate-600">
                                Chat dengan kami di WhatsApp
                            </p>
                        </div>
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="p-1 hover:bg-slate-100 rounded-lg"
                        >
                            <X className="w-3 h-3 text-slate-400" />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={handleClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="group w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-2xl hover:shadow-green-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                title="Chat via WhatsApp"
            >
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                <MessageCircle className="w-8 h-8 text-white relative z-10" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
            </button>
        </div>
    );
}