import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"


const config = defineConfig({
    theme: {
        breakpoints: {

        }
    }
})

export default createSystem(defaultConfig, config);