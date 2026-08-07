import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from '../../features/chat/ChatWidget';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
