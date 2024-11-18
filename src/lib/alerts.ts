"use client";

import toast from "react-hot-toast";

export function clearAlert(id: string | undefined) {
    toast.remove(id);
}

export function alertSuccess(message: string, timeout: number = 2000): string {
    return toast(message, {
        duration: timeout,
        style: { background: "#3b82f6", color: "#fff"},
    })
}

export function alertError(message: string, timeout: number = 5000): string {
    return toast(message, {
        duration: timeout,
        style: { background: "#f56565", color: "#fff"},
    })
}