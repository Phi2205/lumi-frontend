"use client"

import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number; // Auto close after duration (ms), 0 = no auto close
}

export const Notification: React.FC<NotificationProps> = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  duration = 3000
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          ),
          iconBg: 'bg-green-500/20 border-green-500/30',
          iconColor: 'rgba(34, 197, 94, 0.9)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          titleColor: 'text-green-400'
        };
      case 'error':
        return {
          icon: (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          ),
          iconBg: 'bg-red-500/20 border-red-500/30',
          iconColor: 'rgba(239, 68, 68, 0.9)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          titleColor: 'text-red-400'
        };
      case 'warning':
        return {
          icon: (
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          ),
          iconBg: 'bg-yellow-500/20 border-yellow-500/30',
          iconColor: 'rgba(234, 179, 8, 0.9)',
          borderColor: 'rgba(234, 179, 8, 0.3)',
          titleColor: 'text-yellow-400'
        };
      case 'info':
      default:
        return {
          icon: (
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          ),
          iconBg: 'bg-blue-500/20 border-blue-500/30',
          iconColor: 'rgba(59, 130, 246, 0.9)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          titleColor: 'text-blue-400'
        };
    }
  };

  const config = getTypeConfig();
  const defaultTitle = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
  }[type];

  return (
    <div
      className="fixed top-5 right-5 z-[101] p-0 pointer-events-none"
      style={{
        animation: 'slideInRight 0.3s ease'
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div
        className="relative w-full max-w-[400px] backdrop-blur-[20px] rounded-2xl pointer-events-auto shadow-2xl"
        style={{
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${config.borderColor}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="notificationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.12)' }} />
              <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.06)' }} />
              <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.03)' }} />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" rx="16" fill="url(#notificationGrad)" stroke={config.borderColor} strokeWidth="1" />
        </svg>

        <button
          onClick={onClose}
          aria-label="Close notification"
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center cursor-pointer transition-all duration-300 ease z-[1] hover:bg-white/20"
        >
          <svg width={16} height={16} viewBox="0 0 20 20" fill="rgba(255,255,255,0.8)">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="relative p-6 pr-12 z-[1]">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl ${config.iconBg} border flex items-center justify-center shrink-0 backdrop-blur-[10px]`}
              style={{
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              <svg width={24} height={24} fill={config.iconColor} viewBox="0 0 20 20">
                {config.icon}
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={`text-lg font-bold mb-1 ${config.titleColor}`}>
                  {title}
                </h3>
              )}
              {!title && (
                <h3 className={`text-lg font-bold mb-1 ${config.titleColor}`}>
                  {defaultTitle}
                </h3>
              )}
              <p className="text-[14px] text-white/80 leading-[1.5]">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};