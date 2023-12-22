import { ReactNode, useState } from 'react';
type Elements<T = ReactNode> = {
  true: T;
  false: T;
};
export function useBooleanHoverIcon<T>(elements?: Elements<T>) {
  const [hover, onHover] = useState(false);
  const hoveing = (enter: boolean) => {
    if (enter && !hover) {
      onHover(!hover);
      return;
    }
    if (!enter && hover) onHover(!hover);
  };
  return {
    element: elements && (elements[String(!hover) as keyof Elements] as T | undefined),
    hover: !hover,
    onMouseEnter: () => hoveing(true),
    onMouseLeave: () => hoveing(false),
  };
}
