import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ModuleCreationStatus {
    modulesCreated: boolean;
    submodulesCreated: boolean;
}

interface UseModuleCreationPollingResult {
    isLoading: boolean;
    error: string | null;
    attemptCount: number;
}

const useModuleCreationPolling = (
    endpoint: string,
    interval: number = 5000,
    maxAttempts: number = 60
): UseModuleCreationPollingResult => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [attemptCount, setAttemptCount] = useState<number>(0);

    const pollFunction = useCallback(async (): Promise<boolean> => {
        try {
            const response = await axios.get<ModuleCreationStatus>(endpoint);
            return response.data.modulesCreated && response.data.submodulesCreated;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'An error occurred while polling');
            }
            throw error;
        }
    }, [endpoint]);

    useEffect(() => {
        const poll = async () => {
            if (attemptCount >= maxAttempts) {
                setError('Maximum polling attempts reached');
                setIsLoading(false);
                return;
            }

            try {
                const isComplete = await pollFunction();
                if (isComplete) {
                    setIsLoading(false);
                    window.location.reload(); // Reload the page
                } else {
                    setAttemptCount((prevCount) => prevCount + 1);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred during polling');
                setIsLoading(false);
            }
        };

        const timerId = setTimeout(poll, interval);

        return () => clearTimeout(timerId);
    }, [pollFunction, interval, attemptCount, maxAttempts]);

    return { isLoading, error, attemptCount };
};

export default useModuleCreationPolling;