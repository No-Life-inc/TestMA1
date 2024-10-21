import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.node, globals: globals.jest } },
  pluginJs.configs.recommended,
  {
    plugins: {
      jest: pluginJest,
    },
  },
];
