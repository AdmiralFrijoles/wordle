"use client";

import {useGlobalModal} from "@/providers/GlobalModalProvider";
import {useDisclosure} from "@nextui-org/use-disclosure";
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
                // @ts-expect-error TS2345
                .use(rehypeReact, production)
                .process(markdown);
            setContent(file.result);
        })();
    });

    return (
        <BaseModal placement="top" title={(
            <>
                <h2>What&#39;s New</h2>
                <p className="text-sm text-gray-400">{dateFormatter.format(releaseDate.toDate(userTimeZone))}</p>
                <p className="text-tiny text-gray-400">v{APP_VERSION}</p>
            </>
        )} isOpen={isOpen} onOpenChange={onOpenChange}>
            <div className="prose dark:prose-invert prose-sm prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-md prose-h5:text-sm">
                {content}
            </div>
        </BaseModal>
    )
}