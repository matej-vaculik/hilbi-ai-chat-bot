import { RotateCcw, TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import type { Message } from '../hooks/useStreamingChat';

const characters = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const characterDuration = 8;

type Props = {
  message: Message;
  active: boolean;
  retryable: boolean;
  onRetry: () => void;
  onWordFinished: (id: string, index: number) => void;
};

export function ChatMessage({ message, active, retryable, onRetry, onWordFinished }: Props) {
  const lastWord = (message.chunks?.length ?? 0) - 1;
  useEffect(() => {
    if (!active || lastWord < 0) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finishWithoutMotion = () => {
      if (motion.matches) onWordFinished(message.id, lastWord);
    };
    finishWithoutMotion();
    motion.addEventListener('change', finishWithoutMotion);
    return () => motion.removeEventListener('change', finishWithoutMotion);
  }, [active, lastWord, message.id, onWordFinished]);

  if (message.role === 'user') {
    return <article className="message user-message" aria-label="Your message">
      <div className="user-bubble">{message.content}</div>
    </article>;
  }

  return (
    <article className="message assistant-message" aria-label="AI-generated response">
      <div className="assistant-body">
        <div className="assistant-bubble">
          {message.content && <p className="message-content">
            <span className="sr-only">{message.content}</span>
            <span className="message-visual" aria-hidden="true">
            {message.chunks?.length ? message.chunks.map((word, index) => {
              const letters = Array.from(characters.segment(word), ({ segment }) => segment);
              return <span className="stream-token" key={index}>
                {letters.map((letter, letterIndex) => <span
                  className="stream-character"
                  key={letterIndex}
                  style={{ animationDuration: `${characterDuration}ms`, animationDelay: `${letterIndex * characterDuration}ms` }}
                  onAnimationEnd={active && index === lastWord && letterIndex === letters.length - 1
                    ? () => onWordFinished(message.id, index) : undefined}
                >{letter}</span>)}
              </span>;
            }) : message.content}
            </span>
          </p>}
          {active && !message.content && <div className="thinking" aria-hidden="true"><span>Thinking</span><span className="thinking-dots"><i /><i /><i /></span></div>}
          {message.outcome === 'cancelled' && <div className="cancelled-note">{message.content ? 'Response stopped.' : 'Response stopped before it began.'}</div>}
          {message.error && <div className="response-error">
            <div><TriangleAlert size={16} aria-hidden="true" /><span>{message.error}</span></div>
            {retryable && <button className="retry-button" onClick={onRetry}><RotateCcw size={13} aria-hidden="true" />Try again</button>}
          </div>}
          {message.outcome === 'cancelled' && retryable && <button className="retry-button" onClick={onRetry}><RotateCcw size={13} aria-hidden="true" />Try again</button>}
        </div>
        {message.outcome === 'complete' && <hr className="response-divider" aria-hidden="true" />}
      </div>
    </article>
  );
}
