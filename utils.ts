import { To, KeyCode, Manipulator, KarabinerRules, ModifiersKeys, SelectInputSource } from "./types";

/**
 * Custom way to describe a command in a layer
 */
export interface LayerCommand {
  to: To[];
  description?: string;
}

type HyperKeySublayer = {
  // The ? is necessary, otherwise we'd have to define something for _every_ key code
  [key_code in KeyCode]?: LayerCommand;
};

/**
 * Create a Hyper Key sublayer, where every command is prefixed with a key
 * e.g. Hyper + O ("Open") is the "open applications" layer, I can press
 * e.g. Hyper + O + G ("Google Chrome") to open Chrome
 */
export function createHyperSubLayer(
  sublayer_key: KeyCode,
  commands: HyperKeySublayer,
  allSubLayerVariables: string[]
): Manipulator[] {
  const subLayerVariableName = generateSubLayerVariableName(sublayer_key);

  return [
    // When Hyper + sublayer_key is pressed, set the variable to 1; on key_up, set it to 0 again
    {
      description: `Toggle Hyper sublayer ${sublayer_key}`,
      type: "basic",
      from: {
        key_code: sublayer_key,
        modifiers: {
          optional: ["any"],
        },
      },
      to_after_key_up: [
        {
          set_variable: {
            name: subLayerVariableName,
            // The default value of a variable is 0: https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/conditions/variable/
            // That means by using 0 and 1 we can filter for "0" in the conditions below and it'll work on startup
            value: 0,
          },
        },
      ],
      to: [
        {
          set_variable: {
            name: subLayerVariableName,
            value: 1,
          },
        },
      ],
      // This enables us to press other sublayer keys in the current sublayer
      // (e.g. Hyper + O > M even though Hyper + M is also a sublayer)
      // basically, only trigger a sublayer if no other sublayer is active
      conditions: [
        ...allSubLayerVariables
          .filter(
            (subLayerVariable) => subLayerVariable !== subLayerVariableName
          )
          .map((subLayerVariable) => ({
            type: "variable_if" as const,
            name: subLayerVariable,
            value: 0,
          })),
        {
          type: "variable_if",
          name: "hyper",
          value: 1,
        },
      ],
    },
    // Define the individual commands that are meant to trigger in the sublayer
    ...(Object.keys(commands) as (keyof typeof commands)[]).map(
      (command_key): Manipulator => ({
        ...commands[command_key],
        type: "basic" as const,
        from: {
          key_code: command_key,
          modifiers: {
            optional: ["any"],
          },
        },
        // Only trigger this command if the variable is 1 (i.e., if Hyper + sublayer is held)
        conditions: [
          {
            type: "variable_if",
            name: subLayerVariableName,
            value: 1,
          },
        ],
      })
    ),
  ];
}

/**
 * Create all hyper sublayers. This needs to be a single function, as well need to
 * have all the hyper variable names in order to filter them and make sure only one
 * activates at a time
 */
export function createHyperSubLayers(subLayers: {
  [key_code in KeyCode]?: HyperKeySublayer | LayerCommand;
}): KarabinerRules[] {
  const allSubLayerVariables = (
    Object.keys(subLayers) as (keyof typeof subLayers)[]
  ).map((sublayer_key) => generateSubLayerVariableName(sublayer_key));

  return Object.entries(subLayers).map(([key, value]) =>
    "to" in value
      ? {
          description: `Hyper Key + ${key}`,
          manipulators: [
            {
              ...value,
              type: "basic" as const,
              from: {
                key_code: key as KeyCode,
                modifiers: {
                  optional: ["any"],
                },
              },
              conditions: [
                {
                  type: "variable_if",
                  name: "hyper",
                  value: 1,
                },
                ...allSubLayerVariables.map((subLayerVariable) => ({
                  type: "variable_if" as const,
                  name: subLayerVariable,
                  value: 0,
                })),
              ],
            },
          ],
        }
      : {
          description: `Hyper Key sublayer "${key}"`,
          manipulators: createHyperSubLayer(
            key as KeyCode,
            value,
            allSubLayerVariables
          ),
        }
  );
}

function generateSubLayerVariableName(key: KeyCode) {
  return `hyper_sublayer_${key}`;
}

/**
 * Shortcut for "open" shell command
 */
export function open(...what: string[]): LayerCommand {
  return {
    to: what.map((w) => ({
      shell_command: `open ${w}`,
    })),
    description: `Open ${what.join(" & ")}`,
  };
}

/**
 * Utility function to create a LayerCommand from a tagged template literal
 * where each line is a shell command to be executed.
 */
export function shell(
  strings: TemplateStringsArray,
  ...values: any[]
): LayerCommand {
  const commands = strings.reduce((acc, str, i) => {
    const value = i < values.length ? values[i] : "";
    const lines = (str + value)
      .split("\n")
      .filter((line) => line.trim() !== "");
    acc.push(...lines);
    return acc;
  }, [] as string[]);

  return {
    to: commands.map((command) => ({
      shell_command: command.trim(),
    })),
    description: commands.join(" && "),
  };
}

/**
 * Shortcut for managing window sizing with Rectangle
 */
export function rectangle(name: string): LayerCommand {
  return {
    to: [
      {
        shell_command: `open -g rectangle://execute-action?name=${name}`,
      },
    ],
    description: `Window: ${name}`,
  };
}

/**
 * Shortcut for "Open an app" command (of which there are a bunch)
 */
export function app(name: string): LayerCommand {
  return open(`-a '${name}.app'`);
}

export const switchLanguage = ({
  languages,
  // fromLanguage,
  // toLanguage,
  fromToKeyCode,
  modifiers,
  masterModifiers,
}: {
  languages: SelectInputSource[];
  // fromLanguage: string;
  // toLanguage: string;
  fromToKeyCode: KeyCode;
  modifiers: ModifiersKeys[];
  masterModifiers: ModifiersKeys[];
}): Manipulator[] => {

  const number = 1

  const languageSwitch: Manipulator[] = languages.map((language, index) => ({
    type: "basic",
    // "parameters": { "basic.to_delayed_action_delay_milliseconds": 1000 },
    // "to_delayed_action": { "to_if_invoked": [{ "key_code": "caps_lock" }] },
    from: {
      key_code: `f${number + index}` as KeyCode,
      modifiers: {
        mandatory: ["fn"]
        // optional: ["any"],
      },
    },

    // to: [
    //   {
    //     key_code: `f${number + index}` as KeyCode,
    //     // modifiers: ["fn"]
    //   }
    // ],
    to_if_alone: [
      {
        shell_command: `/opt/homebrew/bin/macism ${language.input_source_id}`,
        // select_input_source: language,
        // "shell_command": "osascript -e 'tell application \"System Events\" to command key down'"
      },
    ],
  }))

  // const languageSwitch: Manipulator[] = [];

  // const language = languages[0];

  // languageSwitch.push({
  //   type: "basic",
  //   from: {
  //     key_code: fromToKeyCode,
  //     modifiers: {
  //       mandatory: [...modifiers, ...masterModifiers],
  //     },
  //   },
  //   to: [
  //     {
  //       key_code: fromToKeyCode,
  //       modifiers: [...modifiers, ...masterModifiers],
  //     },
  //   ],
  //   to_if_alone: [
  //     {
  //       select_input_source: language,
  //     },
  //   ],
  // });

  // for (let i = 1; i < languages.length; i++) {
  //   const fromLanguage = languages[i - 1];
  //   const toLanguage = languages[i];

  //   languageSwitch.push({
  //     conditions: [
  //       {
  //         input_sources: [fromLanguage,],
  //         type: "input_source_if",
  //       },
  //     ],
  //     from: {
  //       key_code: fromToKeyCode,
  //       modifiers: {
  //         mandatory: modifiers,
  //       },
  //     },
  //     to: [
  //       {
  //         key_code: fromToKeyCode,
  //         modifiers,
  //       },
  //     ],
  //     to_if_alone: [
  //       {
  //         select_input_source: toLanguage,
  //       },
  //     ],
  //     type: "basic",
  //   });
  // }

  return languageSwitch;
};
