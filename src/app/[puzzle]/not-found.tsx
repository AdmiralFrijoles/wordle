import Link from 'next/link'
import {getPuzzleCount, getRandomPublicPuzzle} from "@/lib/puzzle-service";

export default async function NotFound() {
    const randomPuzzle = await getRandomPublicPuzzle()
    const numPublicPuzzles = await getPuzzleCount(true);

    return (
        <div className="flex flex-col items-center justify-center h-[25vh]">
            <h2 className="text-xl sm:text-2xl font-bold text-nowrap dark:text-white">Oops, that puzzle doesn&#39;t exist.</h2>
            {randomPuzzle ?
                <div className="flex flex-col items-center justify-center">
                    <p>
                        Why not try&nbsp;
                        <Link className="mt-4 mb-2 text-blue-400 dark:text-amber-200" href={`/${randomPuzzle.slug}`}>
                            <span className="font-semibold italic">{randomPuzzle.title}</span>
                        </Link>
                        &nbsp;instead?
                    </p>
                    {numPublicPuzzles > 1 && <p>You may also use the menu to select another puzzle.</p>}
                </div> :
                <Link className="mt-4 text-cyan-200" href="/">Return Home</Link>
            }
        </div>
    )
}