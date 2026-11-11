/**
 * errorManager.ts
 * Centralized, User-Friendly Error Management Engine for QuickJob Platform.
 * Translates technical exceptions into simple, reassuring, and actionable human messages.
 */

import { toast } from 'sonner';
import { errorLogger } from './errorLogger';
import { ApiError, isNetworkError } from './AppError';

export interface FriendlyErrorInfo {
  title: string;
  message: string;
  actionText?: string;
  badgeText?: string;
  isNetwork: boolean;
  canRetry: boolean;
  technicalDetails?: string;
}

/**
 * Parses any caught error and converts it into clean, simple, human-friendly guidance.
 */
export function parseUserFriendlyError(err: unknown, context: string = 'General'): FriendlyErrorInfo {
  errorLogger.error(context, err);

  const rawMessage = String((err as any)?.message || err || '').toLowerCase();

  // 1. Network Disconnection / Timeout Errors
  if (isNetworkError(err) || rawMessage.includes('failed to fetch') || rawMessage.includes('network') || rawMessage.includes('timeout')) {
    return {
      title: 'Connection Temporarily Unavailable',
      message: 'We were unable to reach the live job server. Please check your internet connection and try again.',
      actionText: 'Retry Search',
      badgeText: 'Connection Offline',
      isNetwork: true,
      canRetry: true,
    };
  }

  // 2. Server Busy / 502 / 503 / 500
  if (rawMessage.includes('502') || rawMessage.includes('503') || rawMessage.includes('server') || rawMessage.includes('service unavailable')) {
    return {
      title: 'Live Job Feed Briefly Updating',
      message: 'The direct job aggregation service is briefly updating. We are displaying verified corporate openings.',
      actionText: 'Refresh Feed',
      badgeText: 'Live Feed Updating',
      isNetwork: false,
      canRetry: true,
    };
  }

  // 3. Resume & File Validation Errors
  if (rawMessage.includes('resume') || rawMessage.includes('file') || rawMessage.includes('pdf') || rawMessage.includes('docx') || rawMessage.includes('parse')) {
    return {
      title: 'Resume Format Notice',
      message: 'We could not automatically read this document. Please upload a standard PDF or DOCX file under 10MB.',
      actionText: 'Choose Another File',
      badgeText: 'File Notice',
      isNetwork: false,
      canRetry: false,
    };
  }

  // 4. Rate Limiting / High Frequency
  if (rawMessage.includes('rate') || rawMessage.includes('too many') || rawMessage.includes('429')) {
    return {
      title: 'Taking a Brief Pause',
      message: 'You have performed several searches quickly. Please wait a few seconds before searching again.',
      actionText: 'Wait & Retry',
      badgeText: 'High Frequency',
      isNetwork: false,
      canRetry: true,
    };
  }

  // 5. Default Clean Fallback
  return {
    title: 'Unable to Complete Request',
    message: 'An unexpected issue occurred while processing your search. Please try again or reset your filters.',
    actionText: 'Try Again',
    badgeText: 'Search Notice',
    isNetwork: false,
    canRetry: true,
    technicalDetails: typeof (err as any)?.message === 'string' && (err as any).message.length < 120 ? (err as any).message : undefined,
  };
}

/**
 * Fires a beautifully styled, simple, user-friendly toast message.
 */
export function showFriendlyErrorToast(err: unknown, customFallbackMsg?: string, context = 'UserAction') {
  const info = parseUserFriendlyError(err, context);
  const displayMsg = customFallbackMsg || info.message;

  toast.error(info.title, {
    description: displayMsg,
    duration: 4500,
  });
}

/**
 * Fires a clean user success confirmation.
 */
export function showFriendlySuccessToast(title: string, message?: string) {
  toast.success(title, {
    description: message,
    duration: 3500,
  });
}
