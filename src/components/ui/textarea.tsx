import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoExpand?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, autoExpand = true, ...props }, ref) => {
  const innerRef = React.useRef<HTMLTextAreaElement>(null);
  const combinedRef = (ref as React.MutableRefObject<HTMLTextAreaElement>) || innerRef;

  const adjustHeight = React.useCallback((target: HTMLTextAreaElement) => {
    if (!autoExpand) return;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  }, [autoExpand]);

  React.useEffect(() => {
    const target = innerRef.current;
    if (target && autoExpand) {
      adjustHeight(target);
    }
  }, [props.value, autoExpand, adjustHeight]);

  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden",
        className,
      )}
      ref={(el) => {
        // @ts-ignore
        innerRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      onInput={(e) => {
        adjustHeight(e.currentTarget);
        props.onInput?.(e);
      }}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
