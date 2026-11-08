"use client";

import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody} from "@heroui/react";
import {CloseIcon} from "@/components/icons";

type Props = {
    title: string | React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean,
    onOpenChange: (isOpen: boolean) => void;
    isDismissible?: boolean;
    placement?: "center" | "auto" | "top" | "top-center" | "bottom" | "bottom-center";
}

export default function BaseModal({
                                      title,
                                      children,
                                      isOpen,
                                      onOpenChange,
                                      isDismissible,
                                      placement
}: Props) {
    return (
        <Modal isOpen={isOpen}
               onOpenChange={onOpenChange}
               isDismissable={isDismissible}
               isKeyboardDismissDisabled={isDismissible === false}
               placement={placement ?? "auto"}
               backdrop="opaque"
               scrollBehavior="inside"
               hideCloseButton={true}
               classNames={{
                   backdrop: "bg-[var(--scrim)] backdrop-blur-[4px]",
                   base: "sheet-surface text-fg m-0 w-full max-w-full rounded-t-[28px] rounded-b-none border-b-0 sm:mx-4 sm:my-8 sm:max-w-[420px] sm:rounded-[28px] sm:border-b",
                   header: "flex items-center justify-between gap-3 px-5 pt-2 pb-1 sm:px-6 sm:pt-5",
                   body: "gap-4 px-5 pt-1 pb-[max(28px,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6",
               }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <div aria-hidden="true" className="mx-auto mt-2.5 h-[5px] w-[38px] shrink-0 rounded-full bg-grabber sm:hidden"/>
                        <ModalHeader>
                            <div className="min-w-0 text-xl font-bold tracking-[-0.01em]">{title}</div>
                            <button type="button" aria-label="Close" onClick={onClose}
                                    className="-mr-2.5 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-fg-sub transition-colors hover:bg-hover hover:text-fg">
                                <CloseIcon size={20}/>
                            </button>
                        </ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
