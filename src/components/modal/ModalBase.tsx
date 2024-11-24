"use client";

import {XCircleIcon} from "@heroicons/react/24/outline";
import {Modal, ModalContent, ModalHeader, ModalBody} from "@nextui-org/react";

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
               isKeyboardDismissDisabled={!isDismissible}
               placement={placement ?? "center"}
               backdrop="blur"
               scrollBehavior="inside"
               classNames={{
                   body: "p-0 mt-1",
                   base: "rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle",
                   header: "text-center text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 pt-0 pb-1",
               }}
               closeButton={(
                   <button tabIndex={0} aria-pressed="false" aria-label="close modal" className="absolute right-4 top-4">
                       <XCircleIcon className="h-6 w-6 cursor-pointer animated dark:stroke-white"/>
                   </button>
               )}
        >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col">{title}</ModalHeader>
                    <ModalBody>
                        {children}
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    )
}
