import {useState, useEffect} from 'react';
import frontMatter from 'front-matter';
import removeMd from 'remove-markdown';

export function getMarkdownExcerpt(markdown: string, maxExcerptLength = 70) {
  const parsedMarkdown = frontMatter(markdown)
  let contentText = removeMd(parsedMarkdown.body)
  // Trim and normalize whitespace in content text
  contentText = contentText.trim().replace(/\s+/g, ' ')
  const excerpt = contentText.slice(0, maxExcerptLength)

  if (contentText.length > maxExcerptLength) {
    return excerpt + '...'
  }

  return excerpt
}

interface IWindowSize {
  width: number | undefined;
  height: number | undefined;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<IWindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export const isElectron = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(' electron/') > -1;
}