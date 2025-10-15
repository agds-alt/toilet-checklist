'use client';

import { LogOut, X, AlertTriangle } from 'lucide-react';

interface LogoutConfirmationProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function LogoutConfirmation({ isOpen, onConfirm, onCancel }: LogoutConfirmationProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm p-4 animate-in zoom-in-95 duration-200">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Icon Header */}
                    <div className="relative h-24 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <LogOut className="w-8 h-8 text-red-600" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Logout Confirmation
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout? You'll need to login again to access the app.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/30 hover:shadow-red-600/50 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}