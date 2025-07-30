import { HashLoader } from 'react-spinners';

interface LoaderProps {
  size?: number | string;
  className?: string;
}

export default function Loader({
  size = '100px',
  className = '',
}: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <HashLoader color='#18acac' size={size} speedMultiplier={1} />
    </div>
  );
}
