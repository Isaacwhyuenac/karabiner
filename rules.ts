import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, switchLanguage } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "left_shift",
            modifiers: ["left_command", "left_control", "left_option", "fn"],
          },
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },

      //      {
      //        type: "basic",
      //        description: "Disable CMD + Tab to force Hyper Key usage",
      //        from: {
      //          key_code: "tab",
      //          modifiers: {
      //            mandatory: ["left_command"],
      //          },
      //        },
      //        to: [
      //          {
      //            key_code: "tab",
      //          },
      //        ],
      //      },
    ],
  },

  {
    description: "Send Ctrl + <Shift> + - in VS Code",
    manipulators: [
      {
        conditions: [
          {
            bundle_identifiers: ["com.microsoft.VSCode"],
            type: "frontmost_application_if",
          },
        ],
        from: {
          pointing_button: "button4",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "hyphen",
            modifiers: ["left_control"],
          },
        ],
        type: "basic",
      },
      {
        conditions: [
          {
            bundle_identifiers: ["com.microsoft.VSCode"],
            type: "frontmost_application_if",
          },
        ],
        from: {
          pointing_button: "button5",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "hyphen",
            modifiers: ["left_control", "left_shift"],
          },
        ],
        type: "basic",
      },
    ],
  },
  {
    description: "Send Cmd + Left/Right arrow in non VS Code apps",
    manipulators: [
      {
        conditions: [
          {
            bundle_identifiers: ["com.microsoft.VSCode"],
            type: "frontmost_application_unless",
          },
        ],
        from: {
          pointing_button: "button4",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "left_arrow",
            modifiers: ["left_command"],
          },
        ],
        type: "basic",
      },
      {
        conditions: [
          {
            bundle_identifiers: ["com.microsoft.VSCode"],
            type: "frontmost_application_unless",
          },
        ],
        from: {
          pointing_button: "button5",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "right_arrow",
            modifiers: ["left_command"],
          },
        ],
        type: "basic",
      },
    ],
  },
  ...createHyperSubLayers({
    spacebar: open(
      "raycast://extensions/stellate/mxstbr-commands/create-notion-todo"
    ),
    // b = "B"rowse
    b: {
      t: open("https://twitter.com"),
      // Quarterly "P"lan
      p: open("https://mxstbr.com/cal"),
      y: open("https://news.ycombinator.com"),
      f: open("https://facebook.com"),
      r: open("https://reddit.com"),
      h: open("https://hashnode.com/draft"),
    },
    // o = "Open" applications
    // For example, to open
    o: {
      // 1: app("1Password"),
      c: app("Google Chrome"),
      // c: app("Notion Calendar"),
      // v: app("Zed"),
      d: app("Discord"),
      s: app("Slack"),
      // e: app("Superhuman"),
      n: app("Notion"),
      // t: app("Terminal"),
      // Open todo list managed via *H*ypersonic
      h: open(
        "notion://www.notion.so/stellatehq/7b33b924746647499d906c55f89d5026"
      ),
      // z: app("zoom.us"),
      // "M"arkdown (Reflect.app)
      // m: app("Reflect"),
      // r: app("Reflect"),
      y: app("YouTube"),
      f: app("Finder"),
      // "i"Message
      i: app("IntelliJ IDEA"),
      p: app("PyCharm"),
      g: app("GoLand"),
      r: app("RustRover"),

      v: app("Visual Studio Code"),
      // a: app("iA Presenter"),
      // "W"hatsApp has been replaced by Texts
      // w: open("Texts"),
      l: open(
        "raycast://extensions/stellate/mxstbr-commands/open-mxs-is-shortlink"
      ),
    },

    // TODO: This doesn't quite work yet.
    // l = "Layouts" via Raycast's custom window management
    // l: {
    //   // Coding layout
    //   c: shell`
    //     open -a "Visual Studio Code.app"
    //     sleep 0.2
    //     open -g "raycast://customWindowManagementCommand?position=topLeft&relativeWidth=0.5"

    //     open -a "Terminal.app"
    //     sleep 0.2
    //     open -g "raycast://customWindowManagementCommand?position=topRight&relativeWidth=0.5"
    //   `,
    // },

    // w = "Window" via rectangle.app
    // w: {
    //   semicolon: {
    //     description: "Window: Hide",
    //     to: [
    //       {
    //         key_code: "h",
    //         modifiers: ["right_command"],
    //       },
    //     ],
    //   },
    //   y: rectangle("previous-display"),
    //   o: rectangle("next-display"),
    //   k: rectangle("top-half"),
    //   j: rectangle("bottom-half"),
    //   h: rectangle("left-half"),
    //   l: rectangle("right-half"),
    //   f: rectangle("maximize"),
    //   u: {
    //     description: "Window: Previous Tab",
    //     to: [
    //       {
    //         key_code: "tab",
    //         modifiers: ["right_control", "right_shift"],
    //       },
    //     ],
    //   },
    //   i: {
    //     description: "Window: Next Tab",
    //     to: [
    //       {
    //         key_code: "tab",
    //         modifiers: ["right_control"],
    //       },
    //     ],
    //   },
    //   n: {
    //     description: "Window: Next Window",
    //     to: [
    //       {
    //         key_code: "grave_accent_and_tilde",
    //         modifiers: ["right_command"],
    //       },
    //     ],
    //   },
    //   b: {
    //     description: "Window: Back",
    //     to: [
    //       {
    //         key_code: "open_bracket",
    //         modifiers: ["right_command"],
    //       },
    //     ],
    //   },
    //   // Note: No literal connection. Both f and n are already taken.
    //   m: {
    //     description: "Window: Forward",
    //     to: [
    //       {
    //         key_code: "close_bracket",
    //         modifiers: ["right_command"],
    //       },
    //     ],
    //   },
    // },

    // s = "System"
    s: {
      u: {
        to: [
          {
            key_code: "volume_increment",
          },
        ],
      },
      j: {
        to: [
          {
            key_code: "volume_decrement",
          },
        ],
      },
      i: {
        to: [
          {
            key_code: "display_brightness_increment",
          },
        ],
      },
      k: {
        to: [
          {
            key_code: "display_brightness_decrement",
          },
        ],
      },
      l: {
        to: [
          {
            key_code: "q",
            modifiers: ["right_control", "right_command"],
          },
        ],
      },
      p: {
        to: [
          {
            key_code: "play_or_pause",
          },
        ],
      },
      semicolon: {
        to: [
          {
            key_code: "fastforward",
          },
        ],
      },
      e: open(
        `raycast://extensions/thomas/elgato-key-light/toggle?launchType=background`
      ),
      // "D"o not disturb toggle
      d: open(
        `raycast://extensions/yakitrak/do-not-disturb/toggle?launchType=background`
      ),
      // "T"heme
      t: open(`raycast://extensions/raycast/system/toggle-system-appearance`),
      c: open("raycast://extensions/raycast/system/open-camera"),
      // 'v'oice
      v: {
        to: [
          {
            key_code: "spacebar",
            modifiers: ["left_option"],
          },
        ],
      },
    },

    // v = "moVe" which isn't "m" because we want it to be on the left hand
    // so that hjkl work like they do in vim
    v: {
      h: {
        to: [{ key_code: "left_arrow" }],
      },
      j: {
        to: [{ key_code: "down_arrow" }],
      },
      k: {
        to: [{ key_code: "up_arrow" }],
      },
      l: {
        to: [{ key_code: "right_arrow" }],
      },
      // Magicmove via homerow.app
      m: {
        to: [{ key_code: "f", modifiers: ["right_control"] }],
        // TODO: Trigger Vim Easymotion when VSCode is focused
      },
      // Scroll mode via homerow.app
      s: {
        to: [{ key_code: "j", modifiers: ["right_control"] }],
      },
      d: {
        to: [{ key_code: "d", modifiers: ["right_shift", "right_command"] }],
      },
      u: {
        to: [{ key_code: "page_down" }],
      },
      i: {
        to: [{ key_code: "page_up" }],
      },
    },

    // c = Musi*c* which isn't "m" because we want it to be on the left hand
    c: {
      p: {
        to: [{ key_code: "play_or_pause" }],
      },
      n: {
        to: [{ key_code: "fastforward" }],
      },
      b: {
        to: [{ key_code: "rewind" }],
      },
    },

    // r = "Raycast"
    // r: {
    //   c: open("raycast://extensions/thomas/color-picker/pick-color"),
    //   n: open("raycast://script-commands/dismiss-notifications"),
    //   l: open(
    //     "raycast://extensions/stellate/mxstbr-commands/create-mxs-is-shortlink"
    //   ),
    //   e: open(
    //     "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
    //   ),
    //   p: open("raycast://extensions/raycast/raycast/confetti"),
    //   a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
    //   s: open("raycast://extensions/peduarte/silent-mention/index"),
    //   h: open(
    //     "raycast://extensions/raycast/clipboard-history/clipboard-history"
    //   ),
    //   1: open(
    //     "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
    //   ),
    //   2: open(
    //     "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
    //   ),
    // },
  }),
  // {
  //   description: "Change Backspace to Spacebar when Minecraft is focused",
  //   manipulators: [
  //     {
  //       type: "basic",
  //       from: {
  //         key_code: "delete_or_backspace",
  //       },
  //       to: [
  //         {
  //           key_code: "spacebar",
  //         },
  //       ],
  //       conditions: [
  //         {
  //           type: "frontmost_application_if",
  //           file_paths: [
  //             "^/Users/mxstbr/Library/Application Support/minecraft/runtime/java-runtime-gamma/mac-os-arm64/java-runtime-gamma/jre.bundle/Contents/Home/bin/java$",
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  //   "input_source": {
  //     "input_mode_id": "com.apple.inputmethod.TCIM.Cangjie",
  //     "input_source_id": "com.apple.inputmethod.TCIM.Cangjie",
  //     "language": "zh-Hant"
  // },
  {
    description: "Change Languages",
    manipulators: [
      ...switchLanguage({
        languages: [
          {
            language: "en",
            input_source_id: "com.apple.keylayout.ABC",
          },
          {
            language: "zh-Hant",
            input_source_id: "com.apple.inputmethod.TCIM.Cangjie",
            input_mode_id: "com.apple.inputmethod.TCIM.Cangjie",
          },
          {
            input_mode_id: "com.apple.inputmethod.SCIM.ITABC",
            input_source_id: "com.apple.inputmethod.SCIM.ITABC",
            language: "zh-Hans",
          },
          {
            input_mode_id: "com.apple.inputmethod.Japanese",
            input_source_id:
              "com.apple.inputmethod.Kotoeri.RomajiTyping.Japanese",
            language: "ja",
          },
          {
            input_mode_id: "com.apple.inputmethod.Korean.2SetKorean",
            input_source_id: "com.apple.inputmethod.Korean.2SetKorean",
            language: "ko",
          },
          {
            input_source_id: "com.apple.keylayout.ABC-AZERTY",
            language: "fr",
          },
          {
            input_source_id: "com.apple.keylayout.Spanish-ISO",
            language: "es",
          },
          {
            input_source_id: "com.apple.keylayout.Russian",
            language: "ru",
          },
        ],
        fromToKeyCode: "left_shift",
        modifiers: ["left_control"],
        masterModifiers: ["right_command"],
      }),
    ],
  },
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
