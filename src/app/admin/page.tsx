import AdminApp from '@/components/admin/AdminApp';

export const metadata = {
  title: 'Панель управления — C&B-лаборатория 2.0',
  // Служебная страница: в поиске ей делать нечего
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
