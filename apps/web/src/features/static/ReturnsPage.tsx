import StaticPage from './StaticPage';

export default function ReturnsPage() {
  return (
    <StaticPage title="İade & Değişim">
      <p>
        Ürünlerinizi teslim aldıktan sonra <strong>14 gün</strong> içinde iade
        edebilirsiniz. İade için ürünün kullanılmamış ve etiketlerinin
        çıkarılmamış olması gerekir.
      </p>
      <p>
        Beden değişimi, stokta uygun beden bulunması durumunda ücretsiz olarak
        yapılır. İade süreci onaylandıktan sonra ödemeniz 3-7 iş günü içinde iade
        edilir.
      </p>
    </StaticPage>
  );
}
