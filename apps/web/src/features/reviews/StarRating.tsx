interface Props {
  rating: number;
  onChange?: (value: number) => void; // verilirse tıklanabilir (seçim modu)
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };

export default function StarRating({ rating, onChange, size = 'md' }: Props) {
  const interactive = !!onChange;

  return (
    <div className={`inline-flex ${sizeMap[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange?.(star)}
          className={`${
            star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
