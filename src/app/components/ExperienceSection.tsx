'use client';

import { FaBriefcase, FaCode, FaPalette } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper';
import { Card } from '@/components/CardFloatWrapper';
import { DisplayTag } from '@/components/Tag';

export type ExperienceType = {
  title: string;
  company_name: string;
  description: string;
  date: string;
  technologies: string[];
  icon?: React.ReactNode;
};

export const experiences: ExperienceType[] = [
  {
    title: 'Sketch Artist',
    company_name: 'Personal Creative Work',
    description:
      'Began with challenging my creative side and pursuing artistic dreams, I created illustrations, free-style sketches, and digital designs for my portfolio and social media. I enjoy exploring colors, textures, and visual storytelling to bring ideas to life.',
    date: '2025 - Present',
    technologies: ['Procreate', 'Clip Studio Paint', 'Figma'],
    icon: <FaPalette />,
  },
  {
    title: 'Full Stack Developer',
    company_name: 'Various Tech Companies & Independent Projects',
    description:
      'I’ve worked on building responsive websites, interactive features, and user-friendly interfaces with a strong focus on design and performance. On the back end, I’ve created APIs, databases, and automation tools to make workflows smoother and more efficient. Alongside professional work, I love experimenting with personal projects—especially with R3F, Next.js and Tailwind CSS—to push my skills further.',
    date: '2022 - Present',
    technologies: [
      'HTML',
      'CSS',
      'SCSS',
      'Tailwind CSS',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Python',
      'Django',
      'VBA',
      'Linux',
    ],
    icon: <FaCode />,
  },
];

const ExperienceSection = () => {
  return (
    <SectionWrapper
      title="Experience"
      subtitle="My experiences are more than roles and timelines — they are chapters that shaped the way I think and create. Each project challenged me to grow, to adapt, and to find new ways of solving problems. These lessons stay with me, guiding how I approach creativity today: with curiosity, resilience, and a focus on turning even small details into something meaningful."
      className="scroll-mt-24 flex flex-col mt-32 px-4 w-full gap-8"
    >
      <div className="w-full py-24 relative max-w-7xl mx-auto pb-[700px] overflow-x-hidden">
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-1 top-0 bottom-0 
            bg-gradient-to-b from-lgdg-300 via-lgdg-300 to-transparent"
        ></div>

        <div className="flex flex-col space-y-20 relative">
          {experiences.map((exp, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={index} className="relative flex items-center w-full">
                {/* Node */}
                <div className="absolute left-1/2 -translate-x-[49.9%] w-10 h-10 bg-flame-500 text-gray-100 border-2 border-lgdg-300 rounded-full flex justify-center items-center text-xl shadow-lg shadow-lgdg-300/40">
                  {exp.icon ?? <FaBriefcase />}
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`w-full md:w-1/2 relative px-4 ${
                    isLeft ? 'mr-auto md:pr-12 text-right' : 'ml-auto md:pl-12 text-left'
                  }`}
                >
                  <Card rounded>
                    <div className="flex flex-col justify-center gap-2 m-4 p-4">
                      <div
                        className={`flex text-sm font-bodyBold ${
                          isLeft ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {exp.date}
                      </div>
                      <div className="font-bodyBold text-xl">{exp.title}</div>
                      <div className="text-sm italic mb-2">{exp.company_name}</div>
                      <p className="text-base">{exp.description}</p>
                      <div
                        className={`flex flex-wrap gap-2 mt-2 text-sm ${
                          isLeft ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {exp.technologies.map((tech) => (
                          <DisplayTag key={tech} tag={tech} />
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ExperienceSection;
