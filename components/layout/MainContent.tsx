import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import type { Tab } from '@/app/page';

interface MainContentProps {
  activeTab: Tab;
}

export default function MainContent({ activeTab }: MainContentProps) {
  return (
    <main
      className="main-content-inner"
      style={{
        flex: 1,
        padding: '48px 72px 80px',
        maxWidth: 800,
      }}
    >
      {activeTab === 'about' && <About />}
      {activeTab === 'experience' && <Experience />}
      {activeTab === 'projects' && <Projects />}
    </main>
  );
}
