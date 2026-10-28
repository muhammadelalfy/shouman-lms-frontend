import { useId } from "react";

/** Decorative Islamic geometry: chained eight-pointed stars (khatam) drifting slowly. Static under reduced motion. */
export function IslamicPattern({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div aria-hidden="true" data-component="islamic-pattern" className={`islamic-pattern ${className}`}>
      <svg className="islamic-pattern-field" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <rect x="20" y="20" width="40" height="40" />
              <rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)" />
              <path d="M0 40h11.7M68.3 40H80M40 0v11.7M40 68.3V80" />
              <path d="M0 -6L6 0 0 6-6 0ZM80 -6L86 0 80 6 74 0ZM0 74L6 80 0 86-6 80ZM80 74L86 80 80 86 74 80Z" />
            </g>
          </pattern>
        </defs>
        <g className="islamic-pattern-drift"><rect x="-80" y="-80" width="250%" height="250%" fill={`url(#${id})`} /></g>
      </svg>
    </div>
  );
}
