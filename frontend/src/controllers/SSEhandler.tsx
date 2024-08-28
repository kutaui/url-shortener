import { useEffect } from 'react';

type SSEHandler = (data: any) => void;

export function useSSE(url: string, handleEvent: SSEHandler) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const eventSource = new EventSource(url);

      eventSource.onmessage = function (event) {
        const data = JSON.parse(event.data);
        handleEvent(data);
      };

      return () => {
        eventSource.close();
      };
    }
  }, [url, handleEvent]);
}
