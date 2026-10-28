"use client";

import Link from "next/link";
import { ScrollRevealGroup } from "@/components/motion/scroll-reveal-group";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BorderBeam } from "@/components/ui/border-beam";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ShimmerLink } from "@/components/ui/shimmer-button";
import { useRef, useState, type ReactNode } from "react";
import { BookOpen, LayoutDashboard, Bell, Users, Award, FolderOpen, ClipboardList, CalendarDays, Settings, ShieldCheck, Layers, CreditCard, ChartNoAxesCombined, ListChecks, PanelRightClose, Menu, Compass, MessageSquare, UserRound } from "lucide-react";

const learnerLinks = [
  { href: "/dashboard", label: "لوحتي", icon: LayoutDashboard },
  { href: "/my-learning", label: "تعلّمي", icon: BookOpen },
  { href: "/quizzes", label: "اختباراتي", icon: ClipboardList },
  { href: "/community", label: "المجتمع", icon: Users },
  { href: "/meetings/mine", label: "لقاءاتي", icon: CalendarDays },
  { href: "/projects", label: "مشروعاتي", icon: FolderOpen },
  { href: "/certificates", label: "شهاداتي", icon: Award },
  { href: "/achievements", label: "الإنجازات", icon: ShieldCheck },
  { href: "/notifications", label: "الإشعارات", icon: Bell },
  { href: "/orders", label: "طلباتي", icon: CreditCard },
  { href: "/account", label: "إعدادات المعاينة", icon: Settings },
];
const adminGroups = [
  { label: "نظرة عامة", links: [{ href: "/preview/admin/dashboard", label: "لوحة الإدارة", icon: LayoutDashboard }, { href: "/preview/admin/users", label: "المتعلمون والمستخدمون", icon: Users }, { href: "/preview/admin/roles", label: "الأدوار والصلاحيات", icon: ShieldCheck }] },
  { label: "التعليم والتقييم", links: [{ href: "/preview/admin/offerings", label: "المحتوى التعليمي", icon: BookOpen }, { href: "/preview/admin/quizzes", label: "الاختبارات", icon: ClipboardList }, { href: "/preview/admin/question-bank", label: "بنك الأسئلة", icon: Layers }, { href: "/preview/admin/projects", label: "مشروعات التخرج", icon: FolderOpen }, { href: "/preview/admin/rubrics", label: "معايير التقييم", icon: ListChecks }, { href: "/preview/admin/certificates", label: "الشهادات", icon: Award }] },
  { label: "المجتمع والتواصل", links: [{ href: "/preview/admin/groups", label: "المجموعات", icon: Users }, { href: "/preview/admin/moderation", label: "مراجعة المحتوى", icon: MessageSquare }, { href: "/preview/admin/events", label: "الفعاليات واللقاءات", icon: CalendarDays }, { href: "/preview/admin/attendance", label: "الحضور", icon: ListChecks }, { href: "/preview/admin/notifications", label: "إشعارات الطلاب", icon: Bell }, { href: "/preview/admin/campaigns", label: "الحملات", icon: Bell }, { href: "/preview/admin/gamification", label: "التحفيز والشارات", icon: Award }, { href: "/preview/admin/distinguished", label: "الطلاب المتميزون", icon: Compass }] },
  { label: "التشغيل والتقارير", links: [{ href: "/preview/admin/payments", label: "المدفوعات", icon: CreditCard }, { href: "/preview/admin/coupons", label: "القسائم والعروض", icon: CreditCard }, { href: "/preview/admin/analytics", label: "التحليلات", icon: ChartNoAxesCombined }, { href: "/preview/admin/reports", label: "التقارير", icon: ChartNoAxesCombined }, { href: "/admin/homepage/needs", label: "محتوى الموقع", icon: Layers }, { href: "/preview/admin/audit-log", label: "سجل التدقيق", icon: ListChecks }, { href: "/preview/admin/settings", label: "الإعدادات", icon: Settings }] },
];

export function ExperienceWorkspace({ area, currentPath, children }: { area: "learner" | "admin"; currentPath: string; children: ReactNode }) {
  const teacher = currentPath === "/instructor";
  const staff = area === "admin" || ["/instructor", "/supervisor", "/evaluator"].includes(currentPath);
  const student = area === "learner" && !staff;
  const [expanded, setExpanded] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const previewPath = currentPath.replace(/^\/preview(?=\/(?:dashboard|my-learning)(?:\/|$))/, "");
  const isActive = (href: string) => previewPath === href || previewPath.startsWith(`${href}/`);
  const groups = area === "admin" ? adminGroups : teacher ? [{ label: "نظرة عامة", links: [{ href: "/instructor", label: "لوحة المعلم", icon: LayoutDashboard }] }, { label: "التدريس والمتابعة", links: [{ href: "/instructor#teacher-teaching", label: "أدوات التدريس", icon: BookOpen }, { href: "/instructor#teacher-review", label: "قائمة التحضير", icon: ClipboardList }, { href: "/community", label: "مناقشات المتعلمين", icon: MessageSquare }] }, { label: "التواصل واللقاءات", links: [{ href: "/preview/marketing/notifications", label: "رسالة إلى طلابك", icon: Bell }, { href: "/preview/marketing/meeting?audience=teacher", label: "لقاءات المعلم", icon: CalendarDays }] }, { label: "المساعدة", links: [{ href: "/instructor#teacher-guidance", label: "الصلاحيات والإرشادات", icon: ShieldCheck }, { href: "/account", label: "حسابي", icon: Settings }] }] : [{ label: "مساحتك التعليمية", links: learnerLinks }];
  return <div className={`xp-workspace xp-workspace--${area}${teacher ? " xp-workspace--teacher" : student ? " xp-workspace--student" : ""}`} onKeyDown={event=>{if(event.key==="Escape" && expanded){setExpanded(false);menuTrigger.current?.focus();}}}>
    {area === "admin" && <IslamicPattern className="islamic-pattern-admin" />}
    {teacher && <IslamicPattern className="islamic-pattern-teacher" />}
    {student && <IslamicPattern className="islamic-pattern-student" />}
    <div className="xp-workspace-mobile-bar"><span>{area === "admin" ? "مساحة إدارة المركز" : teacher ? "مساحة المعلم" : "رحلتك التعليمية"}</span><button ref={menuTrigger} className="xp-icon-button" type="button" aria-expanded={expanded} aria-controls="xp-workspace-navigation" aria-label={expanded ? "إغلاق قائمة المساحة" : "فتح قائمة المساحة"} onClick={() => setExpanded((value) => !value)}>{expanded ? <PanelRightClose size={20} /> : <Menu size={20} />}</button></div>
    <aside className={`xp-sidebar ${expanded ? "xp-sidebar--open" : ""}`} id="xp-workspace-navigation"><div className="xp-sidebar-intro academy-beam-panel"><span className="xp-icon-tile">{area === "admin" ? <ShieldCheck size={23} /> : <BookOpen size={23} />}</span><div><strong>{area === "admin" ? "مساحة الإدارة" : teacher ? "مساحة المعلم" : "مساحة المتعلم"}</strong><small>نسخة تصميم تجريبية</small></div><BorderBeam duration={4} size={60} /></div><nav aria-label={area === "admin" ? "أقسام الإدارة" : teacher ? "أقسام المعلم" : "أقسام المتعلم"}>{groups.map((group) => <div className="xp-nav-group" key={group.label}><p>{group.label}</p>{group.links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => setExpanded(false)}><Icon size={18} aria-hidden="true" />{label}</Link>)}</div>)}</nav>{staff && <ShimmerLink href="/preview" className="xp-sidebar-footer academy-dashboard-cta"><Compass size={17} aria-hidden="true" />جميع واجهات الموقع</ShimmerLink>}</aside>
    <ScrollRevealGroup className="xp-workspace-body"><ScrollProgress />{!teacher && !student && area !== "admin" && <IslamicPattern className="islamic-pattern-dashboard" />}{!student && <div className="academy-workspace-pattern" aria-hidden="true"><AnimatedGridPattern numSquares={4} /></div>}{children}</ScrollRevealGroup>
    {area === "learner" && !teacher ? <nav className="xp-bottom-nav" aria-label="التنقل السريع للمتعلم">{[{ href: "/dashboard", label: "لوحتي", icon: LayoutDashboard }, { href: "/my-learning", label: "تعلّمي", icon: BookOpen }, { href: "/community", label: "المجتمع", icon: Users }, { href: "/notifications", label: "الإشعارات", icon: Bell }, { href: "/account", label: "حسابي", icon: UserRound }].map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined}><Icon size={20} aria-hidden="true" /><span>{label}</span></Link>)}</nav> : null}
  </div>;
}
