"use client";

import toast from "react-hot-toast";
import type {CSSProperties} from "react";

const toastStyle: CSSProperties = {
    color: "var(--toast-fg)",
    background: "var(--toast-bg)",
    border: "1px solid rgb(255 255 255 / 0.08)",
    borderRadius: "14px",
    boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 10px 24px -14px rgb(0 0 0 / 0.6)",
    backdropFilter: "blur(16px)",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 600,
};

export function clearAlert(id: string | undefined) {
    toast.remove(id);
}

export function alertSuccess(message: string, timeout: number = 2000): string {
    return toast(message, {
        duration: timeout,
        style: toastStyle,
    })
}

export function alertError(message: string, timeout: number = 5000): string {
    return toast(message, {
        duration: timeout,
        style: toastStyle,
        position: "top-center"
    })
}
