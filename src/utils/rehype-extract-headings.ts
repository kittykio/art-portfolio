import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import * as hast from 'hast';
import type { Heading } from '@/types/HeadingType';
import hasProperty from 'hast-util-has-property';

// --- Plugin Config ---
export type ExtractHeadingsConfig = {
  rank: number;
  headings: Heading[];
};

// --- Plugin Implementation ---
const rehypeExtractHeadings = ({ rank = 2, headings }: ExtractHeadingsConfig) => {
  return (tree: hast.Root) => {
    visit(tree, 'element', (node: hast.Element) => {
      const depth = headingRank(node);

      if (depth && depth <= rank && hasProperty(node, 'id')) {
        const idValue = node.properties.id;

        headings.push({
          title: toString(node),
          id: String(idValue),
          depth,
        });
      }
    });
  };
};

export default rehypeExtractHeadings;
