import { useEffect, useRef, useCallback } from 'react';
import { MilestoneMessage } from '../types';

interface UseWebSocketOptions {
  onMilestone?: (milestone: MilestoneMessage['payload']) => void;
  enabled?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { onMilestone, enabled = true } = options;
  const wsRef = useRef<WebSocket | null>(null);

  const subscribe = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'subscribe',
          payload: { milestones: true },
        })
      );
    }
  }, []);

  const ack = useCallback((habitId: string, milestoneDays: 3 | 7 | 30) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'ack',
          payload: { habitId, milestoneDays },
        })
      );
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        subscribe();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'milestone' && onMilestone) {
            onMilestone(message.payload);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enabled, subscribe, onMilestone]);

  return { subscribe, ack, ws: wsRef.current };
}
