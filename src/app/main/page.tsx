import Profile from '@/components/Profile';
import About from '@/components/About';
import Posts from '@/components/Posts';
import Skills from '@/components/Skills';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function MainPage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <main className="relative z-10 flex flex-col">
          <Profile />
          <About />
          <Posts />
          <Skills />
          <Education />
          <Projects />
          <Contact />
          <Footer />
        </main>
      </div>
    </PageTransition>
  );
}
