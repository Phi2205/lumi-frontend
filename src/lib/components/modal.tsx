"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClassName?: string; // vd: "max-w-[560px]"
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidthClassName = "max-w-[560px]",
  closeOnOverlayClick = true,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const portalTarget = useMemo(() => {
    if (!mounted) return null;
    if (typeof document === "undefined") return null;
    return document.body;
  }, [mounted]);

  if (!isOpen || !portalTarget) return null;

  return createPortal(
    <>
      <div
        onClick={closeOnOverlayClick ? onClose : undefined}
        className="fixed inset-0 bg-black/50 backdrop-blur-[8px] z-[100]"
        style={{
          WebkitBackdropFilter: "blur(8px)",
          animation: "fadeIn 0.3s ease",
        }}
      />

      <div className="fixed inset-0 z-[101] p-5">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(12px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>

        <div
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${maxWidthClassName} backdrop-blur-[20px] rounded-3xl overflow-hidden max-h-[calc(100vh-40px)]`}
          style={{
            WebkitBackdropFilter: "blur(20px)",
            animation: "slideIn 0.4s ease",
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="modalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "rgba(255,255,255,0.12)" }} />
                <stop offset="50%" style={{ stopColor: "rgba(255,255,255,0.06)" }} />
                <stop offset="100%" style={{ stopColor: "rgba(255,255,255,0.03)" }} />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" rx="24" fill="url(#modalGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </svg>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer transition-all duration-300 ease z-[1] hover:bg-white/20"
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="relative z-[1] overflow-auto max-h-[calc(100vh-40px)]">
            {(title || description) && (
              <div className="px-6 pt-6 pb-4 border-b border-white/10">
                {title && <div className="text-xl font-bold text-white leading-[1.2]">{title}</div>}
                {description && <div className="mt-1 text-sm text-white/70 leading-[1.5]">{description}</div>}
              </div>
            )}

            <div className="px-6 py-5">{children}</div>

            {footer && <div className="px-6 pb-6 pt-4 border-t border-white/10">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  , portalTarget);
};

