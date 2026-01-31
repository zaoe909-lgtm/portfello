import BlogPreview from '@/components/sections/blog-preview';
import Certifications from '@/components/sections/certifications';
import Contact from '@/components/sections/contact';
import Education from '@/components/sections/education';
import Experience from '@/components/sections/experience';
import Hero from '@/components/sections/hero';
import Projects from '@/components/sections/projects';
import Skills from '@/components/sections/skills';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Certifications />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
