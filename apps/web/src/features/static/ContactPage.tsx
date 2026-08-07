import StaticPage from './StaticPage';

export default function ContactPage() {
  return (
    <StaticPage title="İletişim">
      <p>Bize aşağıdaki kanallardan ulaşabilirsiniz:</p>
      <ul className="list-none space-y-2 pl-0">
        <li>📧 E-posta: destek@moda.com</li>
        <li>📞 Telefon: 0850 000 00 00 (Hafta içi 09:00 - 18:00)</li>
        <li>📍 Adres: Örnek Mah. Moda Cad. No:1, Bursa</li>
      </ul>
      <p>
        Sorularınız için müşteri hizmetlerimiz hafta içi her gün size yardımcı
        olmaktan memnuniyet duyar.
      </p>
    </StaticPage>
  );
}
