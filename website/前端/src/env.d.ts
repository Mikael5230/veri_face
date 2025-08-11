/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // 如果后面还会新增其它 VITE_ 开头的环境变量，就在这里声明：
    // readonly VITE_ANOTHER_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
