// ============================================
// components/layout/Footer.tsx
// ============================================
'use client';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-auto border-t border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-sm">AGDS Corporation</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                                    EST. {currentYear}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500">Professional Cleaning Management</p>
                        </div>
                    </div>

                   <div className="text-center">
                                          <p className="text-xs text-slate-500 mt-0.5">
                            Founded & Managed by <span className="font-semibold text-slate-700">Abdul Gofur</span>
                        </p>
                    </div>

                    
                </div>
            </div>
        </footer>
    );
}