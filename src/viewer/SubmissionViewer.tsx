import { useEffect, useRef } from "react";
import { copy } from "../app/i18n";
import Icon from "../components/Icon";
import type { Locale } from "../types";

export default function SubmissionViewer({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const text = copy[locale].submit;
  const mailto = `mailto:neica.labs@gmail.com?subject=${encodeURIComponent(text.emailSubject)}&body=${encodeURIComponent(text.emailBody)}`;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const previousStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    Object.assign(document.body.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      width: "100%",
      overflow: "hidden",
    });
    dialog.current?.showModal();
    closeButton.current?.focus();
    return () => {
      dialog.current?.close();
      Object.assign(document.body.style, previousStyle);
      window.scrollTo(0, scrollY);
      previous?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="submission-viewer"
      aria-labelledby="submission-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button
        ref={closeButton}
        className="viewer-button submission-viewer-close"
        type="button"
        onClick={onClose}
        aria-label={copy[locale].viewer.close}
      >
        <Icon name="close" />
      </button>
      <div className="submission-viewer-inner">
        <span className="submission-viewer-label">WHAT’S NEXT? / {text.label}</span>
        <h2 id="submission-title">{text.heading}</h2>
        <div className="submission-viewer-prose">
          <p>{text.lead}</p>
          <p>{text.body}</p>
          <p>{text.process}</p>
        </div>
        <a className="submission-email" href={mailto}>
          {text.emailAction} <span aria-hidden="true">↗</span>
        </a>
        <span className="submission-address">neica.labs@gmail.com</span>
      </div>
    </dialog>
  );
}
