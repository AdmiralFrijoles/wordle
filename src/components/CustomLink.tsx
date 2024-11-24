import Link from 'next/link';

type Props = {
    children: React.ReactNode;
    href: string;
}

export default function CustomLink({ children, href }: Props) {
    // If the link is local it will start with a "/"
    // Otherwise it'll be something like "https://"
    return href.startsWith('/') || href === '' ? (
        <Link href={href}>
            <a>
                {children}
            </a>
        </Link>
    ) : (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    );
}
