const Path = require("path");
const vuePlugin = require("@vitejs/plugin-vue");

const { defineConfig } = require("vite");

export default async ({ mode }) => {
  return await defineConfig({
    root: Path.join(__dirname, "src", "renderer"),
    publicDir: "public",
    server: {
      port: 8080,
    },
    open: false,
    build: {
      outDir: Path.join(__dirname, "build", "renderer"),
      emptyOutDir: true,
    },
    plugins: [vuePlugin()],
    // 配置文件别名，vite1.0是/@/， 2.0改为/@
    resolve: {
        alias: {
          '@': Path .resolve(__dirname, './src'),
        }
    },
  });
};

/**
 * https://vitejs.dev/config
 */
// const config = defineConfig({
//     root: Path.join(__dirname, 'src', 'renderer'),
//     publicDir: 'public',
//     server: {
//         port: 8080,
//     },
//     open: false,
//     build: {
//         outDir: Path.join(__dirname, 'build', 'renderer'),
//         emptyOutDir: true,
//     },
//     plugins: [vuePlugin()],
// });

// module.exports = config;
