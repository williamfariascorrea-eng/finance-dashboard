interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '4px' }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton width="60%" height="16px" />
      <Skeleton width="40%" height="32px" />
      <Skeleton width="80%" height="14px" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="skeleton-chart">
      <Skeleton width="100%" height="300px" borderRadius="12px" />
    </div>
  );
}

export function TransactionSkeleton() {
  return (
    <div className="skeleton-transaction">
      <Skeleton width="54px" height="54px" borderRadius="18px" />
      <div className="skeleton-transaction__content">
        <Skeleton width="70%" height="16px" />
        <Skeleton width="50%" height="14px" />
      </div>
      <Skeleton width="80px" height="24px" borderRadius="99px" />
    </div>
  );
}