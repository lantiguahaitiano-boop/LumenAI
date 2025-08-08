

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {

  const renderSimpleMarkdown = (text: string) => {
    // Basic bold and italic support
    const withBold = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const withItalic = withBold.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return withItalic;
  };

  const renderContent = () => {
    // Split by code blocks first to isolate them
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);

    const elements: React.ReactElement[] = [];

    parts.forEach((part, index) => {
      if (index % 2 === 1) { // This is a code block
        elements.push(
          <pre key={`code-${index}`} className="bg-slate-800 dark:bg-slate-900 text-white p-4 rounded-md overflow-x-auto my-4 text-sm">
            <code>{part.trim()}</code>
          </pre>
        );
      } else { // This is regular text
        const lines = part.split('\n');
        let listType: 'ul' | 'ol' | null = null;
        let listItems: React.ReactElement[] = [];

        const flushList = () => {
          if (listItems.length > 0) {
            if (listType === 'ul') {
              elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-4 pl-4 text-slate-700 dark:text-slate-300">{listItems}</ul>);
            } else if (listType === 'ol') {
              elements.push(<ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-4 pl-4 text-slate-700 dark:text-slate-300">{listItems}</ol>);
            }
            listItems = [];
            listType = null;
          }
        };

        lines.forEach((line, lineIndex) => {
          const key = `line-${index}-${lineIndex}`;

          // Headers
          if (line.startsWith('# ')) {
            flushList();
            elements.push(<h1 key={key} className="text-3xl font-bold my-4 text-slate-800 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(line.substring(2)) }} />);
            return;
          }
          if (line.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={key} className="text-2xl font-bold my-3 text-slate-800 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(line.substring(3)) }} />);
            return;
          }
          if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={key} className="text-xl font-bold my-2 text-slate-800 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(line.substring(4)) }} />);
            return;
          }

          // Unordered list
          if (line.match(/^\* /)) {
            if (listType !== 'ul') {
              flushList();
              listType = 'ul';
            }
            listItems.push(<li key={key} dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(line.substring(2)) }} />);
            return;
          }
          
          // Ordered list
          if (line.match(/^\d+\. /)) {
            if (listType !== 'ol') {
              flushList();
              listType = 'ol';
            }
            listItems.push(<li key={key} dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(line.substring(line.indexOf(' ') + 1)) }} />);
            return;
          }

          // If we encounter a non-list line, flush any existing list
          flushList();

          // Paragraphs
          if (line.trim()) {
            elements.push(<p key={key} className="my-2 text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(line) }} />);
          } else if (elements.length > 0 && lines.length > 1 && elements[elements.length -1].type !== 'div') {
             // Add a visual break for empty lines between content, but not for leading/trailing empty lines of a part
             elements.push(<div key={key} className="h-2"></div>);
          }
        });

        flushList(); // Add any remaining list items at the end of the part
      }
    });

    return elements;
  };

  return <div className="max-w-none leading-relaxed">{renderContent()}</div>;
};
