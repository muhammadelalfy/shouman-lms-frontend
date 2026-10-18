"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./password-input.css";

export function PasswordInput({ toggleLabel = "كلمة المرور", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { toggleLabel?: string }) {
  const [visible, setVisible] = useState(false);
  return <div className="academy-password-input"><input {...props} type={visible ? "text" : "password"} /><button type="button" aria-label={`${visible ? "إخفاء" : "إظهار"} ${toggleLabel}`} aria-pressed={visible} aria-controls={props.id} onClick={() => setVisible((value) => !value)}>{visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button></div>;
}
