import { defineConfig } from "vitest/config";
import "dotenv/config";

let config;

if (process.env.TESTING_TYPE === "integration") {
    console.log(
        "Setting up testing vitest configuration for integration testing..."
    );
    console.warn(
        `TESTING_TYPE is set to ${process.env.TESTING_TYPE}. Mocking will not work in this configuration!`
    );
    config = defineConfig({
        test: {
            clearMocks: true,
            environment: "node",
            setupFiles: [],
            include: ["**/*.integration.test.js"],
        },
    });
}

export default config;
