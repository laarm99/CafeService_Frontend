import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

export default function AppErrorBoundary({ children }) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
        >
            {children}
        </ErrorBoundary>
    );
}