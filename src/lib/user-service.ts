"use server";

import prisma from "@/lib/prisma";
import {User} from "@prisma/client";

export async function getOrCreateUser(externalId: string, username: string, profilePicture?: string, displayName?: string) {
    return prisma.user.upsert({
        include: {profile: true},
        where: {externalId: externalId},
        update: {
            username: username,
            profile: {
                upsert: {
                    update: {
                        picture: profilePicture,
                        displayName: displayName
                    },
                    create: {
                        picture: profilePicture,
                        displayName: displayName
                    }
                }
            }
        },
        create: {
            externalId: externalId,
            username: username,
            profile: {
                create: {
                    picture: profilePicture,
                    displayName: displayName
                }
            }
        }
    })
}