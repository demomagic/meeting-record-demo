import NotionEditor from '@/components/NotionEditor';
import UsageGuide from '@/components/UsageGuide';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <NotionEditor />
      </div>
      <UsageGuide />
    </div>
  );
}
