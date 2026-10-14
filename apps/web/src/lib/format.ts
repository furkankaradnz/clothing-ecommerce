export function formatPrice(n: number | string): string {
  return Number(n).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}

// İndirim yüzdesi hesabı
export function discountPercent(base: number | string, discount: number | string): number {
  const b = Number(base);
  const d = Number(discount);
  if (!b || !d || d >= b) return 0;
  return Math.round((1 - d / b) * 100);
}
