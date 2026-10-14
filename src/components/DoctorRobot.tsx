/** A lightweight, decorative companion. Motion is controlled by CSS. */
export function DoctorRobot({ greet = true, onGreeted }: { greet?: boolean; onGreeted?: () => void }) {
  return (
    <svg className="doctor-robot" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <ellipse className="robot-shadow" cx="80" cy="143" rx="34" ry="5" />
      {greet && <g transform="translate(160 0) scale(-1 1)">
        <g className="robot-wave" onAnimationEnd={onGreeted}>
        {/* Mirror the arm to the other side, with a chunky toy-style C gripper. */}
        <path d="M118 110L129 140L142 127" stroke="var(--text)" strokeWidth="7" strokeLinejoin="round" />
        <path d="M118 110L129 140L142 127" stroke="var(--accent-strong)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="129" cy="140" r="4" fill="var(--surface)" stroke="var(--text)" strokeWidth="2" />
        <circle cx="129" cy="140" r="1.3" fill="var(--accent-strong)" />
        <rect x="138" y="123" width="8" height="7" rx="1.5" fill="var(--accent-strong)" stroke="var(--text)" strokeWidth="2" />
        <path
          d="M134 101A12 12 0 1 0 152 101L148 105A6.5 6.5 0 1 1 138 105Z"
          fill="var(--accent-strong)"
          stroke="var(--text)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M134 113Q135 119 140 120" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>}
      <g className="robot-head">
        <path d="M80 27V18" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
        <circle className="robot-antenna" cx="80" cy="15" r="5" fill="var(--highlight)" />
        <rect x="28" y="67" width="13" height="29" rx="6.5" fill="var(--accent-strong)" stroke="var(--text)" strokeWidth="2.5" />
        <rect x="119" y="67" width="13" height="29" rx="6.5" fill="var(--accent-strong)" stroke="var(--text)" strokeWidth="2.5" />
        <rect x="39" y="42" width="82" height="78" rx="28" fill="var(--surface)" stroke="var(--text)" strokeWidth="2.5" />
        <rect x="49" y="65" width="62" height="39" rx="17" fill="var(--accent-soft)" />
        <g className="robot-eyes" fill="var(--text)">
          <rect x="61" y="76" width="6" height="11" rx="3" />
          <rect x="93" y="76" width="6" height="11" rx="3" />
        </g>
        <path d="M73 93Q80 99 87 93" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M42 55V44C42 35 49 29 58 29H102C111 29 118 35 118 44V55H42Z" fill="var(--surface)" stroke="var(--text)" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M80 37V47M75 42H85" stroke="var(--highlight)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M56 115V121C56 130 64 134 70 129C73 126 74 121 74 116M65 134V138H94V127" stroke="var(--text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="95" cy="121" r="6" fill="var(--accent-strong)" stroke="var(--text)" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
