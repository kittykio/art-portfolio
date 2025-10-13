'use client';

import Socials from '@/components/footer/Socials';
import { Magnetic } from '../Magnetic';
import Link from 'next/link';

// The Connect component displays contact information and social media links.
const Connect = () => {
  return (
    // Container for all connection elements, using flex layout for stacking.
    <div className="flex flex-col gap-8 flex-wrap items-center lg:items-start">
      {/* Section title for the connection links. */}
      <p className="font-heading text-lg font-bodyBold text-dglg-900">Connect</p>

      {/* Wrapped email address inside a custom animated button. */}
      <Magnetic>
        <Link href="mailto:itskittykio@gmail.com">
          <p className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-dglg-700 hover:border-none hover:text-gray-100 font-bodyBold hover:bg-flame-500 transition-all shadow-md">
            itskittykio@gmail.com
          </p>
        </Link>
      </Magnetic>

      {/* Component to display the social media icons and links. */}
      <Socials />
    </div>
  );
};

export default Connect;
