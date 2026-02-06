'use client';

import Link from 'next/link';
import { Magnetic } from '../Magnetic';

const General = () => {
  return (
    <div className="flex flex-col gap-8 flex-wrap items-center lg:items-start">
      <p className="font-heading text-lg font-bodyBold text-dglg-900">General</p>
      <ul className="flex flex-col gap-4 uppercase items-center lg:items-start">
        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href="/">Home</Link>
          </Magnetic>
        </li>
        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href="/#get-to-know-me">About Momo</Link>
          </Magnetic>
        </li>

        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href="/#interest">Areas of Work</Link>
          </Magnetic>
        </li>

        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href="/artwork">Artwork</Link>
          </Magnetic>
        </li>

        <li className="hover:text-flame-500">
          <Magnetic>
            <Link href="/blog">Blog</Link>
          </Magnetic>
        </li>
      </ul>
    </div>
  );
};

export default General;
