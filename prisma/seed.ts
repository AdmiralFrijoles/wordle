import {PrismaClient} from "@prisma/client"
import {parseArgs} from 'node:util'
import {startOfToday,formatISO} from "date-fns";
import {utc} from "@date-fns/utc"

const prisma = new PrismaClient();

const options = {
    environment: { type: 'string' },
}

async function main() {
    const {
        values: { environment },
    } = parseArgs({
        // @ts-expect-error TS2322
        options
    })

    const isDev = environment === 'dev';

    if (isDev) {
        const testUser = await prisma.user.upsert({
            where: {username: "testuser01"},
            update: {},
            create: {
                username: "testuser01",
                profile: {
                    create: {
                        displayName: "Test User 01"
                    }
                }
            }
        });
        console.log(testUser);

        const testPuzzle1 = await prisma.puzzle.upsert({
            where: {slug: "testpuzzle01"},
            update: {},
            create: {
                slug: "testpuzzle01",
                title: "Test Puzzle 01",
                description: "Test puzzle number 1"
            }
        });
        console.log(testPuzzle1);

        const todayOnly = formatISO(startOfToday({in: utc}));
        const testPuzzle1Solution = await prisma.solution.upsert({
            where: {
                puzzleId_date: {puzzleId: testPuzzle1.id, date: todayOnly}
            },
            update: {},
            create: {
                puzzleId: testPuzzle1.id,
                date: todayOnly,
                solution: "TESTS",
                maxGuesses: 6
            }
        });
        console.log(testPuzzle1Solution);

        const testPuzzle2 = await prisma.puzzle.upsert({
            where: {slug: "testpuzzle02"},
            update: {},
            create: {
                slug: "testpuzzle02",
                title: "Test Puzzle 02"
            }
        });
        console.log(testPuzzle2);
    }

    const nytPuzzle = await prisma.puzzle.upsert({
        where: {slug: "nyt"},
        update: {},
        create: {
            slug: "nyt",
            title: "New York Times",
            description: "Follows the daily word of the New York Times Wordle game."
        }
    });
    console.log(nytPuzzle);

    const dojoPuzzle = await prisma.puzzle.upsert({
        where: {slug: "dojo"},
        update: {},
        create: {
            slug: "dojo",
            title: "Dojo",
            description: "Words specifically chosen for the Dojo."
        }
    });
    console.log(dojoPuzzle);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });