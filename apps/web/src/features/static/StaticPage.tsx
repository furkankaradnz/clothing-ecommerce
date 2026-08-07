import { ReactNode } from 'react';

// Basit statik içerik sayfası şablonu
export default function StaticPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-4 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
