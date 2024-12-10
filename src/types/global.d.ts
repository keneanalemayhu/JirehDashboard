import "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    "use client"?: string;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
  }

  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: "submit" | "reset" | "button";
  }
}
