"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";

// Typography for Strapi rich text. Spacing lives in .prose (globals.css), so
// headings always get more room above than below.
const blocks = {
  heading: ({ children, level }) => {
    const Tag = `h${level}`;
    const className = level <= 3 ? "prose-heading" : "prose-subheading t-kicker";
    return <Tag className={className}>{children}</Tag>;
  },
  paragraph: ({ children }) => <p>{children}</p>,
  quote: ({ children }) => <blockquote className="prose-quote">{children}</blockquote>,
  list: ({ children, format }) => {
    const Tag = format === "ordered" ? "ol" : "ul";
    return <Tag>{children}</Tag>;
  },
  link: ({ children, url }) => {
    const external = /^https?:/.test(url);
    return (
      <a href={url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
};

export default function BlocksContent({ content, className = "" }) {
  // Empty rich-text fields come back as null, which BlocksRenderer cannot handle.
  if (!Array.isArray(content) || content.length === 0) return null;

  return (
    <div className={`prose ${className}`}>
      <BlocksRenderer content={content} blocks={blocks} />
    </div>
  );
}
