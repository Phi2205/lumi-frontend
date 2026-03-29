// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { createPortal } from "react-dom";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: React.ReactNode;
//   description?: React.ReactNode;
//   children: React.ReactNode;
//   footer?: React.ReactNode;
//   maxWidthClassName?: string; // vd: "max-w-[560px]"
//   closeOnOverlayClick?: boolean;
//   className?: string;
// }

// export const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   description,
//   children,
//   footer,
//   maxWidthClassName = "max-w-[560px]",
//   closeOnOverlayClick = true,
//   className,
// }) => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     return () => setMounted(false);
//   }, []);
  
//   // Lock body scroll when modal is open
//   useEffect(() => {
//     if (!isOpen) return;
//     const originalOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = originalOverflow;
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) return;
//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [isOpen, onClose]);

//   const portalTarget = useMemo(() => {
//     if (!mounted) return null;
//     if (typeof document === "undefined") return null;
//     return document.body;
//   }, [mounted]);

//   if (!isOpen || !portalTarget) return null;

//   return createPortal(
//     <>
//       <div
//         onClick={closeOnOverlayClick ? onClose : undefined}
//         className={`fixed inset-0 bg-black/50 z-[100]`}
//         style={{
//           WebkitBackdropFilter: "blur(8px)",
//           animation: "fadeIn 0.3s ease",
//         }}
//       />

//       <div className={`fixed inset-0 z-[101] p-5 ${className}`}>
//         <style>{`
//           @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//           }
//           @keyframes slideIn {
//             from {
//               opacity: 0;
//               transform: scale(0.96) translateY(12px);
//             }
//             to {
//               opacity: 1;
//               transform: scale(1) translateY(0);
//             }
//           }
//         `}</style>

//         <div
//           className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${maxWidthClassName} backdrop-blur-[20px] rounded-3xl overflow-hidden max-h-[calc(100vh-40px)]`}
//           style={{
//             WebkitBackdropFilter: "blur(20px)",
//             animation: "slideIn 0.4s ease",
//           }}
//         >
//           <svg className="absolute inset-0 w-full h-full pointer-events-none">
//             <defs>
//               <linearGradient id="modalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" style={{ stopColor: "rgba(30,30,30,0.98)" }} />
//                 <stop offset="50%" style={{ stopColor: "rgba(20,20,20,0.98)" }} />
//                 <stop offset="100%" style={{ stopColor: "rgba(10,10,10,0.99)" }} />
//               </linearGradient>
//             </defs>
//             <rect x="0" y="0" width="100%" height="100%" rx="24" fill="url(#modalGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
//           </svg>

//           <button
//             onClick={onClose}
//             aria-label="Close modal"
//             className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer transition-all duration-300 ease z-[50] hover:bg-white/20 hover:scale-110 active:scale-95"
//           >
//             <svg width={20} height={20} viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)">
//               <path
//                 fillRule="evenodd"
//                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>

//           <div className="relative z-[1] overflow-auto max-h-[calc(100vh-40px)]">
//             {(title || description) && (
//               <div className="px-6 pt-6 pb-4 border-b border-white/10">
//                 {title && <div className="text-xl font-bold text-white leading-[1.2]">{title}</div>}
//                 {description && <div className="mt-1 text-sm text-white/70 leading-[1.5]">{description}</div>}
//               </div>
//             )}

//             <div className="px-6 py-5">{children}</div>

//             {footer && <div className="px-6 pb-6 pt-4 border-t border-white/10">{footer}</div>}
//           </div>
//         </div>
//       </div>
//     </>
//   , portalTarget);
// };

"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
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
    className?: string;
    blur?: number;       // default: 24 (px)
    refraction?: number; // default: 0.12 (opacity)
    depth?: number;      // default: 1 (shadow multiplier)
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
    className,
    blur = 5,
    refraction = 0.05,
    depth = 0,
}) => {
    const [mounted, setMounted] = useState(false);
    const id = useId();
    const gradId = `modalGrad-${id.replace(/:/g, "")}`;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

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
                className="fixed inset-0 bg-black/60 z-[100]"
                style={{
                    WebkitBackdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    animation: "fadeIn 0.3s ease",
                }}
            />

            <div className={`fixed inset-0 z-[101] p-5 flex items-center justify-center ${className}`}>
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
                    className={`relative w-full ${maxWidthClassName} rounded-[32px] overflow-hidden max-h-[calc(100vh-40px)]`}
                    style={{
                        WebkitBackdropFilter: `blur(${blur}px)`,
                        backdropFilter: `blur(${blur}px)`,
                        boxShadow: depth > 0 ? `0 25px 50px -12px rgba(0, 0, 0, ${0.5 * depth})` : "none",
                        animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: "rgba(20, 20, 20, 0.65)" }} />
                                <stop offset="50%" style={{ stopColor: "rgba(10, 10, 10, 0.75)" }} />
                                <stop offset="100%" style={{ stopColor: "rgba(0, 0, 0, 0.85)" }} />
                            </linearGradient>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradId})`} />
                        {/* Subtle inner border for glass effect using refraction prop */}
                        <rect
                            x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)"
                            rx="31.5" fill="none"
                            stroke={`rgba(255,255,255,${refraction})`} strokeWidth="1"
                        />
                    </svg>

                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-300 ease z-[50] hover:bg-white/15 hover:scale-110 active:scale-95 text-white/60 hover:text-white"
                    >
                        <svg width={16} height={16} viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    <div className="relative z-[1] flex flex-col max-h-[calc(100vh-40px)]">
                        {(title || description) && (
                            <div className="px-8 pt-8 pb-5 border-b border-white/5">
                                {title && <div className="text-2xl font-bold text-white tracking-tight leading-none">{title}</div>}
                                {description && <div className="mt-2 text-sm text-white/40 leading-relaxed">{description}</div>}
                            </div>
                        )}

                        <div className="px-8 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
                            {children}
                        </div>

                        {footer && (
                            <div className="px-8 py-6 border-t border-white/5 bg-white/[0.02]">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
        , portalTarget);
};



