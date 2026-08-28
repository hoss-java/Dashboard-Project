// src/utils/errorMessages.ts

import { ErrorType } from '../types/ErrorTypes';

export interface ErrorMessage {
  title: string;
  description: string;
  suggestion: string;
  icon: string;
  severity: 'error' | 'warning' | 'info';
}

export const ERROR_MESSAGES: Record<ErrorType, ErrorMessage> = {
  [ErrorType.NAT_TRAVERSAL_FAILED]: {
    title: 'Connection Setup Failed',
    description: 'Unable to establish a direct peer-to-peer connection.',
    suggestion: 'We are using an alternative connection method. Try sending a message.',
    icon: '🔌',
    severity: 'warning',
  },
  [ErrorType.TIMEOUT]: {
    title: 'Connection Timeout',
    description: 'The connection attempt took too long to complete.',
    suggestion: 'Check your internet connection and try connecting again.',
    icon: '⏱️',
    severity: 'error',
  },
  [ErrorType.DATA_CHANNEL_FAILED]: {
    title: 'Message Channel Failed',
    description: 'Unable to send messages through the direct connection.',
    suggestion: 'Messages will be sent through an alternative route. No action needed.',
    icon: '💬',
    severity: 'warning',
  },
  [ErrorType.PEER_OFFLINE]: {
    title: 'Peer Offline',
    description: 'The person you are trying to reach is currently offline.',
    suggestion: 'Your message will be queued and delivered when they reconnect.',
    icon: '📴',
    severity: 'info',
  },
  [ErrorType.WEBSOCKET_FAILED]: {
    title: 'Connection Lost',
    description: 'Lost connection to the messaging service.',
    suggestion: 'Reconnecting automatically. Check your internet connection.',
    icon: '🌐',
    severity: 'error',
  },
  [ErrorType.MISSING_DATA]: {
    title: 'Data Not Available',
    description: 'Required information could not be loaded.',
    suggestion: 'Try refreshing the page or contact support if the issue persists.',
    icon: '⚠️',
    severity: 'warning',
  },
  [ErrorType.UNKNOWN]: {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred.',
    suggestion: 'Try again or refresh the page if the problem continues.',
    icon: '❌',
    severity: 'error',
  },
};

export function getErrorMessage(errorType: ErrorType): ErrorMessage {
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN];
}
