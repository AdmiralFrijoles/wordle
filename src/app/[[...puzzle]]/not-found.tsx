import Link from 'next/link'
import {getRandomPublicPuzzle} from "@/lib/puzzle-service";

export default async function NotFound() {
    const randomPuzzle = await getRandomPublicPuzzle()

    return (
        <div className="glass mt-6 flex flex-col items-center gap-4 rounded-[22px] px-6 py-8 text-center">
            <h2 className="text-xl font-bold tracking-[-0.01em] text-fg sm:text-2xl">That puzzle doesn&#39;t exist</h2>
            {randomPuzzle ?
                <>
                    <p className="text-sm text-fg-sub">Try another puzzle instead.</p>
                    <Link className="btn-primary flex h-[52px] items-center rounded-2xl px-6 text-base font-bold"
                          href={`/${randomPuzzle.slug}`}>
                        Play {randomPuzzle.title}
                    </Link>
                </> :
                <Link className="btn-primary flex h-[52px] items-center rounded-2xl px-6 text-base font-bold" href="/">
                    Return Home
                </Link>
            }
        </div>
    )
}
