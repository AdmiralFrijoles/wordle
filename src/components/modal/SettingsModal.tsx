"use client";

import HeaderIcon from "@/components/header/HeaderIcon";
import {useDisclosure} from "@heroui/react";
import {SettingsIcon} from "@/components/icons";
import BaseModal from "@/components/modal/ModalBase";
import SettingsToggle from "@/components/settings/SettingsToggle";
import {useSettings} from "@/providers/SettingsProvider";
import {alertError} from "@/lib/alerts";
import {APP_VERSION} from "@/constants";
import {useGlobalModal} from "@/providers/GlobalModalProvider";

export default function SettingsModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const settings = useSettings();
    const changelogModal = useGlobalModal("changelog");

    function trySetIsHardMode(enabled: boolean) {
        if (!settings.canSetIsHardMode) {
            alertError("Hard Mode can only be enabled at the start!");
            return;
        }
        settings.setIsHardMode(enabled);
    }

    return (
        <>
            <HeaderIcon label="Settings" onPress={onOpen}>
                <SettingsIcon/>
            </HeaderIcon>
            <BaseModal title="Settings" isOpen={isOpen} onOpenChange={onOpenChange}>
                <div className="glass flex flex-col divide-y divide-line rounded-[18px]">
                    <SettingsToggle
                        settingName="Hard Mode"
                        flag={settings.isHardMode}
                        handleFlag={trySetIsHardMode}
                        description="Any revealed hints must be used in subsequent guesses"
                    />
                    <SettingsToggle
                        settingName="Dark Mode"
                        flag={settings.isDarkMode}
                        handleFlag={settings.setIsDarkMode}
                    />
                    <SettingsToggle
                        settingName="High Contrast Mode"
                        flag={settings.isHighContrast}
                        handleFlag={settings.setIsHighContrast}
                        description="For improved color vision"
                    />
                </div>
                <div className="glass flex items-center gap-4 rounded-[18px] px-4 py-3.5">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-base font-semibold text-fg">App Version</span>
                        <span className="text-[13px] text-fg-sub tabular-nums">v{APP_VERSION}</span>
                    </div>
                    {changelogModal &&
                        <button type="button" onClick={changelogModal.onOpen}
                                className="btn-primary h-11 shrink-0 cursor-pointer rounded-xl px-4 text-sm font-semibold">
                            What&#39;s New
                        </button>}
                </div>
            </BaseModal>
        </>
    )
}