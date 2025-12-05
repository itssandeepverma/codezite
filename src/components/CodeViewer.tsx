import React, { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import 'highlight.js/styles/github.css';
import '../styles/app.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('cpp', cpp);

interface CodeViewerProps {
  code: string;
  language: 'javascript' | 'python' | 'cpp';
  highlightLine?: number;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code, language, highlightLine }) => {
  const highlightedLines = useMemo(() => {
    const safeLang = hljs.getLanguage(language) ? language : 'javascript';
    const html = hljs.highlight(code, { language: safeLang }).value;
    return html.split('\n');
  }, [code, language]);

  return (
    <div className="code-viewer light" aria-label={`Code viewer ${language}`}>
      {highlightedLines.map((lineHtml, idx) => {
        const lineNumber = idx + 1;
        const isHighlight = lineNumber === highlightLine;
        return (
          <div key={lineNumber} className={`code-line ${isHighlight ? 'highlight' : ''}`}>
            <span className="code-line-number">{lineNumber.toString().padStart(2, '0')}</span>
            <code dangerouslySetInnerHTML={{ __html: lineHtml || '&nbsp;' }} />
          </div>
        );
      })}
    </div>
  );
};

export default CodeViewer;
