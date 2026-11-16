/** O lucide não traz ícones de marca; este é o mesmo traço do site anterior. */
export function IconeWhatsApp({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.9 21.2l4.6-1.2A9.2 9.2 0 1 0 12 2.8z" />
      <path d="M8.6 7.9c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.4l.8 1.9c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3 0 .6a7 7 0 0 0 3.1 2.7c.3.1.5 0 .6-.1l.5-.6c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5v.5c0 .3-.2.6-.5.8-.4.3-1 .5-1.6.5-1.5 0-3.7-1.2-5.2-2.6C8.2 13.6 7.1 11.8 7.1 10.3c0-.8.2-1.4.6-1.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}
