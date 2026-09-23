import { useMemo, useState } from "react";
import { withBase } from "../lib/base";

type CourseStatus = "available" | "in-production" | "coming-soon";

interface Course {
  slug: string;
  title: string;
  modality: string;
  description: string;
  status: CourseStatus;
}

const statusLabel: Record<CourseStatus, string> = {
  available: "Available now",
  "in-production": "In production",
  "coming-soon": "Coming soon",
};

export default function CourseCatalog({ courses }: { courses: Course[] }) {
  const modalities = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((c) => c.modality)))],
    [courses],
  );
  const [active, setActive] = useState("All");

  const visible = active === "All" ? courses : courses.filter((c) => c.modality === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter courses by modality">
        {modalities.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={active === m}
            onClick={() => setActive(m)}
            className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors"
            style={{
              borderColor: "var(--border)",
              background: active === m ? "var(--accent)" : "transparent",
              color: active === m ? "var(--accent-contrast)" : "var(--text-muted)",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((course) => (
          <a key={course.slug} href={withBase(`/courses#${course.slug}`)} className="bracket-frame block">
            <span className="bf-corner" aria-hidden="true"></span>
            <span className="bf-corner" aria-hidden="true"></span>
            <div className="relative flex h-full flex-col justify-between p-5" style={{ background: "var(--surface)" }}>
              <div>
                <span className="tag-mono">{statusLabel[course.status].toUpperCase()}</span>
                <h3 className="mt-2 text-[15px] font-semibold">{course.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {course.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
