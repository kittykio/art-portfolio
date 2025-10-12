import React, { Children, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { disperse } from './anim';

// --- Types ---
type TextDisperseProps = {
  children: ReactNode;
  setRef?: (active: boolean) => void;
};

type CharElement = React.ReactElement<ReactNode, string | React.JSXElementConstructor<ReactNode>>;

// Define the precise type for a valid element whose props we want to access.
// This tells TypeScript the element has props, and those props contain 'children'.
type ValidChildElement = React.ReactElement<{ children?: ReactNode }>;

const DisperseText = ({ children, setRef }: TextDisperseProps) => {
  const [isAnimated, setIsAnimated] = useState(false);

  // ... splitWord function remains unchanged ...
  const splitWord = (text: string): CharElement[] => {
    const length = text.length;

    return text.split('').map((char, i) => (
      <motion.span
        key={text + i}
        custom={i}
        variants={{
          open: () => disperse.open(i, length),
          closed: disperse.closed,
        }}
        animate={isAnimated ? 'open' : 'closed'}
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    )) as CharElement[];
  };

  const getDispersedChildren = (content: ReactNode): CharElement[] => {
    const charsArray: CharElement[] = [];

    Children.forEach(content, (child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        charsArray.push(...splitWord(String(child)));
      }
      // 💡 FIX: Type check and property check combined.
      // 1. Check if it's a valid element.
      // 2. Check if the 'props' object contains a 'children' key at runtime.
      else if (React.isValidElement(child) && 'children' in child.props) {
        // Assert the child to our specific type that is guaranteed to have 'props'
        // containing 'children' (based on the runtime check).
        const typedChild = child as ValidChildElement;

        // This assignment and member access is now safe and compliant
        charsArray.push(...getDispersedChildren(typedChild.props.children));
      }
    });

    return charsArray;
  };

  const handleMouseEnter = () => {
    setRef?.(true);
    setIsAnimated(true);
  };

  const handleMouseLeave = () => {
    setRef?.(false);
    setIsAnimated(false);
  };

  return (
    <span
      className="flex cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {getDispersedChildren(children)}
    </span>
  );
};

export default DisperseText;
