"use client"
import { useEffect } from 'react';

type SSEHandler = (data: any) => void;

export function useSSE(url: string, handleEvent: SSEHandler) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        handleEvent(data);
      };

      eventSource.onerror = function (error) {
        console.error("EventSource failed:", error);
      };

      return () => {
        eventSource.close();
      };
    }
  }, [url, handleEvent]);
}
