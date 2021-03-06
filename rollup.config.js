import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import del from "rollup-plugin-delete";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "src/index.ts",
    output: {
      globals: {
        "htna": "htna"
      },
      file: "dist/umd/index.js",
      format: "umd",
      name: "htnaComponents",
      esModule: false,
      sourcemap: true
    },
    // external: ["htna"],
    plugins: [
      del({
        targets: ["./dist/umd/*"]
      }),
      typescript({
        typescript: require("typescript")
      }),
      peerDepsExternal(),
      postcss({
        extract: false,
        modules: false,
        inject: false,
        minimize: true,
        plugins: []
      }),
      terser({
        output: {
          comments: false
        }
      })
    ]
  },
  {
    input: {
      index: "src/index.ts"
    },
    output: {
      globals: {
        "htna": "htna"
      },
      dir: "./dist/esm",
      format: "esm",
      sourcemap: true
    },
    // preserveModules: true,
    // external: ["htna"],
    plugins: [
      del({
        targets: ["./dist/esm/*"]
      }),
      typescript({
        typescript: require("typescript")
      }),
      peerDepsExternal(),
      resolve(),
      postcss({
        extract: false,
        modules: false,
        inject: false,
        minimize: true,
        plugins: []
      }),
      terser({
        output: {
          comments: false
        }
      })
    ]
  }
];
