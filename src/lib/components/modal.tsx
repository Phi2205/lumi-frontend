import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-[8px] z-[100]"
        style={{
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}
      />
      
      <div 
        className="fixed inset-0 flex items-center justify-center z-[101] p-5"
        style={{
          animation: 'slideIn 0.4s ease'
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>
        
        <div 
          className="relative w-full max-w-[480px] backdrop-blur-[20px] rounded-3xl"
          style={{
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="modalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.12)'}} />
                <stop offset="50%" style={{stopColor: 'rgba(255,255,255,0.06)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(255,255,255,0.03)'}} />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" rx="24" fill="url(#modalGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </svg>

          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer transition-all duration-300 ease z-[1] hover:bg-white/20"
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="relative p-10 pb-8 z-[1]">
            <div 
              className="w-[72px] h-[72px] mx-auto mb-5 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-[10px]"
              style={{
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              <svg width={48} height={48} fill="rgba(255,255,255,0.9)" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-3 leading-[1.3]">
              Confirm Your Action
            </h2>
            
            <p className="text-[15px] text-white/80 text-center leading-[1.6] mb-7">
              Are you sure you want to proceed with this action? This operation cannot be undone and will affect your current settings.
            </p>

            <div className="flex flex-col gap-3 mb-7">
              <div 
                className="flex items-center gap-3 p-3.5 px-4 bg-white/6 border border-white/12 rounded-2xl backdrop-blur-[10px]"
                style={{
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <div className="w-9 h-9 rounded-[10px] bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
                  <svg width={16} height={16} fill="rgba(255,255,255,0.7)" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/60 mb-0.5 font-medium">
                    Time
                  </div>
                  <div className="text-sm text-white/95 font-medium">
                    Processing time: ~2 minutes
                  </div>
                </div>
              </div>

              <div 
                className="flex items-center gap-3 p-3.5 px-4 bg-white/6 border border-white/12 rounded-2xl backdrop-blur-[10px]"
                style={{
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <div className="w-9 h-9 rounded-[10px] bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
                  <svg width={16} height={16} fill="rgba(255,255,255,0.7)" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/60 mb-0.5 font-medium">
                    Security
                  </div>
                  <div className="text-sm text-white/95 font-medium">
                    Encrypted & verified
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3.5 px-6 text-[15px] font-semibold rounded-xl cursor-pointer transition-all duration-300 ease text-white/90 bg-white/8 border border-white/15 hover:bg-white/15 hover:-translate-y-0.5"
              >
                Cancel
              </button>
              
              <button 
                onClick={onClose}
                className="flex-1 py-3.5 px-6 text-[15px] font-semibold rounded-xl cursor-pointer transition-all duration-300 ease text-white bg-white/20 border border-white/30 hover:bg-white/30 hover:-translate-y-0.5"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

