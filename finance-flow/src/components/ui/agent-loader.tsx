import { cn } from "@/lib/utils";

export const AgentLoaderPulse = ({
    className,
    size = "md",
}: {
    className?: string;
    size?: "sm" | "md" | "lg";
}) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <div
                className={cn(
                    "absolute animate-ping rounded-full bg-primary/20 opacity-75",
                    sizeClasses[size]
                )}
            />
            <div
                className={cn(
                    "relative rounded-full bg-primary shadow-soft animate-pulse",
                    sizeClasses[size]
                )}
            />
            <span className="sr-only">Agent is processing...</span>
        </div>
    );
};
