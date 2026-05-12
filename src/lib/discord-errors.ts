export class DiscordReauthRequiredError extends Error {
    constructor(message = "Discord re-authentication required") {
        super(message);
        this.name = "DiscordReauthRequiredError";
    }
}
