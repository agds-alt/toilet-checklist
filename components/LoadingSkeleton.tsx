export default function LoadingSkeleton() {
    return (
        <div className="space-y-4 p-6">
            {/* Header Skeleton */}
            <div className="flex gap-4 mb-6">
                <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-8 gap-2 p-4 bg-gray-50 border-b">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>

                {/* Table Rows */}
                {[...Array(10)].map((_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-8 gap-2 p-4 border-b">
                        {[...Array(8)].map((_, colIndex) => (
                            <div
                                key={colIndex}
                                className="h-16 bg-gray-100 rounded animate-pulse"
                                style={{ animationDelay: `${(rowIndex * 8 + colIndex) * 50}ms` }}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer Skeleton */}
            <div className="flex justify-between items-center mt-4">
                <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}