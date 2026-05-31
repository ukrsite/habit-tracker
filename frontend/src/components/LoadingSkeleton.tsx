export const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="card p-6 h-64"
          style={{
            animation: `skeleton-loading 2s infinite`,
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className="skeleton h-6 w-1/2 mb-3 rounded-lg" />
          <div className="skeleton h-4 w-full mb-4 rounded-lg" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="skeleton h-8 rounded-lg" />
            ))}
          </div>
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonText = ({ width = 'w-1/2', height = 'h-4' }: { width?: string; height?: string }) => (
  <div className={`skeleton ${width} ${height} rounded-lg`} />
);

export const SkeletonCard = () => (
  <div className="card p-6 h-64 animate-pulse">
    <div className="skeleton h-6 w-2/3 mb-2 rounded-lg" />
    <div className="skeleton h-4 w-full mb-4 rounded-lg" />
    <div className="skeleton h-10 w-full rounded-xl" />
  </div>
);
