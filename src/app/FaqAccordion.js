import BlocksContent from "./BlocksContent";
import { blocksToText } from "./caseFormat";

// Splits the FAQ rich text at its headings: each heading becomes a question,
// the blocks up to the next heading its answer. Native <details>, so no JS.
function splitQuestions(content) {
  const items = [];
  for (const block of content ?? []) {
    if (block.type === "heading") {
      items.push({ question: blocksToText(block).trim(), answer: [] });
    } else if (items.length > 0) {
      items.at(-1).answer.push(block);
    }
  }
  return items;
}

export default function FaqAccordion({ content, countLabel }) {
  const items = splitQuestions(content);
  if (items.length === 0) return <BlocksContent content={content} />;

  return (
    <div className="faq">
      <p className="faq-count t-kicker">{items.length} {countLabel}</p>
      <div className="faq-list">
        {items.map((item, index) => (
          <details key={item.question} className="faq-item" open={index === 0}>
            <summary className="faq-question">
              <span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="faq-question-text">{item.question}</h2>
              <svg className="faq-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            </summary>
            <BlocksContent content={item.answer} className="faq-answer" />
          </details>
        ))}
      </div>
    </div>
  );
}
