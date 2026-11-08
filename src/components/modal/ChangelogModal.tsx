"use client";

import {useGlobalModal} from "@/providers/GlobalModalProvider";
import {useDisclosure} from "@heroui/react";
import BaseModal from "@/components/modal/ModalBase";
import {APP_VERSION, APP_RELEASE_DATE} from "@/constants"
import {DateFormatter, getLocalTimeZone, parseDate} from "@internationalized/date";
import {unified} from "unified";
import rehypeReact from "rehype-react";
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import * as prod from 'react/jsx-runtime'
import {useMount} from "react-use";
import {Fragment, createElement, useState} from 'react'
import CustomLink from "@/components/CustomLink";

const production = {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components: {
        a: CustomLink,
    }
}

export default function ChangelogModal() {
    const {isOpen, onOpenChange} = useGlobalModal("changelog", useDisclosure())!;
    const userTimeZone = getLocalTimeZone();
    const userLocale = (new Intl.NumberFormat()).resolvedOptions().locale;
    const dateFormatter = new DateFormatter(userLocale, {dateStyle: "long"});
    const releaseDate = parseDate(APP_RELEASE_DATE);
    const [content, setContent] = useState(createElement(Fragment))

    useMount(() => {
        ;(async function() {
            const markdown = await fetch(`/changelog/${APP_VERSION}.md`).then(res => res.text());
            const file = await unified()
                .use(remarkParse)
                .use(remarkRehype)
                .use(rehypeReact, production)
                .process(markdown);
            setContent(file.result);
        })();
    });

    return (
        <BaseModal title={(
            <div className="flex flex-col gap-0.5">
                <h2>What&#39;s New</h2>
                <p className="text-[13px] font-medium tracking-normal text-fg-sub">
                    {dateFormatter.format(releaseDate.toDate(userTimeZone))}, v{APP_VERSION}
                </p>
            </div>
        )} isOpen={isOpen} onOpenChange={onOpenChange}>
            <div className="prose prose-sm dark:prose-invert prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h5:text-sm">

                {content}
            </div>
        </BaseModal>
    )
}