import { DefaultTheme } from "styled-components";

import {
  primaryDark,
  primaryDarkA,
  secondaryDark,
  secondaryDarkA,
  neutralDark,
  infoDark,
} from "./colors";
import { font } from "./font";

import {
  ButtonTheme,
  ThemeOverrides,
  dangerDark,
  dangerDarkBtn,
  successDark,
  successDarkBtn,
  warningDark,
  warningDarkBtn,
} from "@daohaus/ui";

import {
  blueDark,
  greenDark,
  pinkDark,
  redDark,
  sand,
  sandA,
  sandDark,
  sandDarkA,
  violetDark,
  yellowDark,
} from "@radix-ui/colors";

export const pgDarkMono = {
  step1: "hsl(0, 0%, 100%)",
  step2: "hsl(0, 0%, 66%)",
  step3: "hsl(0, 0%, 22%)",
  step4: "hsl(0, 0%, 0%)",
  step5: "rgba(255, 0, 0, 0)",
  step6: "rgba(0, 0, 0, 1)",
  step7: "rgba(255, 255, 255, 1)",
};

// export const pgDarkPrimaryBtn = {
//   ...primaryDarkBtn,
//   solid: {
//     text: pgDarkMono.step1,
//     bg: pgDarkMono.step5,
//     border: pgDarkMono.step1,
//     bgHover: pgDarkMono.step5,
//     borderHover: pgDarkMono.step2,
//     bgFocus: pgDarkMono.step2,
//     borderFocus: pgDarkMono.step1,
//     bgDisabled: pgDarkMono.step5,
//     borderDisabled: pgDarkMono.step3,
//   },
//   ghost: {
//     text: pgDarkMono.step1,
//     bgHover: pgDarkMono.step4,
//     borderFocus: pgDarkMono.step4,
//     disabled: pgDarkMono.step4,
//   },
// };

// export const pgDarkSecondaryBtn = {
//   ...secondaryDarkBtn,
//   solid: {
//     text: pgDarkMono.step1,
//     bg: pgDarkMono.step3,
//     border: pgDarkMono.step3,
//     bgHover: pgDarkMono.step2,
//     borderHover: pgDarkMono.step2,
//     bgFocus: pgDarkMono.step3,
//     borderFocus: pgDarkMono.step1,
//     bgDisabled: pgDarkMono.step3,
//     borderDisabled: pgDarkMono.step3,
//   },
//   outline: {
//     ...pgDarkPrimaryBtn.solid,
//   },
// };

// export const secondary = {
//   step1: sandDark.sand1,
//   step2: sandDark.sand1,
//   step3: sandDark.sand1,
//   step4: sandDark.sand1,
//   step5: sandDark.sand1,
//   step6: sandDark.sand1,
//   step7: sandDark.sand1,
//   step8: sandDark.sand1,
//   step9: sandDark.sand1,
//   step10: sandDark.sand1,
//   step11: sandDark.sand1,
//   step12: sandDark.sand1,
// };

// export const secondaryA = {
//   step1: sandA.sandA1,
//   step2: sandA.sandA1,
//   step3: sandA.sandA1,
//   step4: sandA.sandA1,
//   step5: sandA.sandA1,
//   step6: sandA.sandA1,
//   step7: sandA.sandA1,
//   step8: sandA.sandA1,
//   step9: sandA.sandA1,
//   step10: sandA.sandA1,
//   step11: sandA.sandA1,
//   step12: sandA.sandA1,
// };

export const pgPrimaryDarkBtn: ButtonTheme = {
  solid: {
    text: primaryDark.step1,
    bg: primaryDark.step9,
    border: primaryDark.step9,
    bgHover: primaryDark.step10,
    borderHover: primaryDark.step10,
    bgFocus: primaryDark.step9,
    borderFocus: primaryDark.step11,
    bgDisabled: primaryDark.step6,
    borderDisabled: primaryDark.step6,
  },
  outline: {
    text: primaryDark.step9,
    border: primaryDark.step9,
    hover: primaryDark.step10,
    focus: primaryDark.step11,
    disabled: primaryDark.step6,
  },
  ghost: {
    text: primaryDark.step10,
    bgHover: primaryDark.step3,
    borderFocus: primaryDark.step4,
    disabled: primaryDark.step8,
  },
  link: {
    text: primaryDark.step9,
    hover: primaryDark.step10,
    focus: primaryDark.step11,
    disabled: primaryDark.step6,
  },
};

export const pgSecondaryDarkBtn: ButtonTheme = {
  solid: {
    text: secondaryDark.step12,
    bg: secondaryDark.step6,
    border: secondaryDark.step6,
    bgHover: secondaryDark.step7,
    borderHover: secondaryDark.step7,
    bgFocus: secondaryDark.step6,
    borderFocus: secondaryDark.step8,
    bgDisabled: secondaryDark.step3,
    borderDisabled: secondaryDark.step3,
  },
  outline: {
    text: secondaryDark.step9,
    border: secondaryDark.step9,
    hover: secondaryDark.step10,
    focus: secondaryDark.step11,
    disabled: secondaryDark.step6,
  },
  ghost: {
    text: secondaryDark.step10,
    bgHover: secondaryDark.step3,
    borderFocus: secondaryDark.step4,
    disabled: secondaryDark.step8,
  },
  link: {
    text: secondaryDark.step9,
    hover: secondaryDark.step10,
    focus: secondaryDark.step11,
    disabled: secondaryDark.step6,
  },
};

// export const pgDarkTheme: ThemeOverrides = {
//   themeName: "pgdark",
//   rootBgColor: "rgba(0,0,0,1)",
//   rootFontColor: pgDarkMono.step1,
//   secondary: { ...secondary },
//   secondaryA: { ...secondaryA },
//   border: {
//     radius: "1px",
//   },
//   link: {
//     color: sand.sand12,
//     active: {
//       border: sand.sand12,
//       color: sand.sand12,
//     },
//   },
//   navigationMenu: {
//     root: {
//       bg: pgDarkMono.step6,
//     },
//     content: {
//       bg:  pgDarkMono.step6,
//       border: pgDarkMono.step3,
//     },
//     baseItem: {
//       color: pgDarkMono.step7,
//       hover: {
//         bg: pgDarkMono.step7,
//       },
//       focus: {
//         bg: pgDarkMono.step7,
//       },
//     },
//     link: {
//       active: {
//         border: pgDarkMono.step7,
//         color: pgDarkMono.step7,
//       },
//     },
//   },

//   font: {
//     family: pgDarkFontFamily,
//     size: {
//       xs: "1.2rem",
//       sm: "1.4rem",
//       md: "1.6rem",
//       lg: "2rem",
//       xl: "2.4rem",
//       xxl: "3.2rem",
//       xxxl: "4rem",
//       xxxxl: "4.8rem",
//     },
//     weight: {
//       extraLight: 200,
//       light: 300,
//       reg: 400,
//       med: 500,
//       bold: 700,
//       black: 900,
//     },
//     lineHeight: "150%",
//     letterSpacing: "1.5px",
//   },
//   field: {
//     ...defaultDarkTheme.field,
//     radius: "4px",
//     inputFont: pgDarkFontFamily.data,
//     labelFont: pgDarkFontFamily.header,
//   },
//   button: {
//     primary: pgDarkPrimaryBtn,
//     secondary: pgDarkSecondaryBtn,
//     success: successDarkBtn,
//     warning: warningDarkBtn,
//     danger: dangerDarkBtn,
//     radius: "4px",
//   },
//   card: {
//     bg: secondary.step6,
//     border: pgDarkMono.step7,
//     radius: "8px",
//   },
//   input: {
//     ...defaultDarkTheme.input,
//     border: pgDarkMono.step5,
//     bg: secondary.step3,
//     color: pgDarkMono.step1,
//     hover: {
//       bg: secondary.step3,
//       border: pgDarkMono.step1,
//     },
//     focus: {
//       bg: secondary.step3,
//       border: pgDarkMono.step1,
//     },
//   },
//   inputSelect: {
//     bg: secondary.step3,
//     color: secondaryDark.step12,
//     hover: {
//       bg: secondary.step4,
//     },
//     focus: {
//       bg: secondary.step5,
//     },
//     disabled: {
//       bg: secondary.step2,
//     },
//     selectBox: {
//       bg: secondary.step6,
//     },
//   },
//   select: {
//     bg: secondary.step2,
//     border: 'transparent',
//     radius: 1,
//     color: pgDarkMono.step1,
//     hover: {
//       bg: secondary.step4,
//       border: secondary.step4,
//     },
//     focus: {
//       bg: secondary.step3,
//       border: secondary.step6,
//     },
//     disabled: {
//       bg: neutral.step5,
//       color: neutral.step5,
//       placeholder: neutral.step10,
//     },
//     success: {
//       border: success.step9,
//     },
//     warning: {
//       border: warning.step9,
//     },
//     error: {
//       border: danger.step9,
//     },
//     option: {
//       bg: secondary.step3,
//       color: pgDarkMono.step1,
//     },
//     icon: {
//       color: pgDarkMono.step1,
//     },
//   },
//   textarea: {
//     bg: secondary.step3,
//     border: secondary.step1,
//     color: secondary.step12,
//     placeholder: secondary.step11,
//     hover: {
//       bg: secondary.step4,
//       border: secondary.step4,
//     },
//     focus: {
//       bg: secondary.step3,
//       border: secondary.step6,
//     },
//     disabled: {
//       bg: neutralDark.step5,
//       border: neutralDark.step5,
//       placeholder: neutralDark.step10,
//     },
//     success: {
//       border: successDark.step9,
//     },
//     warning: {
//       border: warningDark.step9,
//     },
//     error: {
//       border: dangerDark.step9,
//     },
//   },
//   dropdown: {
//     ...defaultDarkTheme.dropdown,
//     content: {
//       primary: {
//         bg: pgDarkMono.step5,
//       },
//       secondary: {
//         bg: pgDarkMono.step5,
//       },
//     },
//     item: {
//       primary: {
//         bg: "transparent",
//       },
//       secondary: {
//         bg: pgDarkMono.step5,
//       },
//       focus: {
//         primary: {
//           bg: "transparent",
//         },
//         secondary: {
//           bg: "transparent",
//         },
//       },
//       highlight: {
//         primary: {
//           bg: pgDarkMono.step4,
//         },
//         secondary: {
//           bg: pgDarkMono.step4,
//         },
//       },
//       disabled: {
//         color: pgDarkMono.step5,
//       },
//     },
//   },
//   toast: {
//     ...defaultDarkTheme.toast,
//     bg: pgDarkMono.step3,
//     border: pgDarkMono.step5,
//     success: {
//       bg: pgDarkMono.step3,
//       border: pgDarkMono.step5,
//     },
//   },
// };

export const protocolGuildDarkTheme: DefaultTheme = {
  themeName: "dark",
  font,
  transparent: "transparent",
  rootBgColor: neutralDark.step1,
  rootFontColor: secondaryDark.step12,
  primary: { ...primaryDark },
  primaryA: { ...primaryDarkA },
  secondary: { ...secondaryDark },
  secondaryA: { ...secondaryDarkA },
  success: { ...successDark },
  warning: { ...warningDark },
  danger: { ...dangerDark },
  info: { ...infoDark },
  neutral: { ...neutralDark },
  ...blueDark,
  ...violetDark,
  ...pinkDark,
  ...greenDark,
  ...yellowDark,
  ...redDark,
  field: {
    fontWeight: font.weight.reg,
    fontSize: font.size.md,
    inputFont: font.family.body,
    labelFont: font.family.header,
    size: {
      md: "28rem",
      lg: "52rem",
      full: "100%",
    },
    radius: "1px",
    transition: "0.2s all ease-in-out",
  },
  // *** ATOMS *** //
  avatar: {
    bg: neutralDark.step9,
  },
  button: {
    primary: pgPrimaryDarkBtn,
    secondary: pgSecondaryDarkBtn,
    success: successDarkBtn,
    warning: warningDarkBtn,
    danger: dangerDarkBtn,
    radius: "4px",
  },
  card: {
    bg: secondaryDark.step2,
    border: secondaryDark.step5,
    radius: "0.8rem",
  },
  checkbox: {
    bg: secondaryDark.step3,
    border: secondaryDark.step6,
    radius: "1px",
    hover: {
      bg: secondaryDark.step4,
      border: secondaryDark.step6,
    },
    focus: {
      bg: secondaryDark.step3,
      border: secondaryDark.step7,
    },
    disabled: {
      bg: neutralDark.step2,
      border: neutralDark.step6,
    },
    active: {
      bg: primaryDark.step3,
      border: primaryDark.step9,
      hover: {
        bg: primaryDark.step4,
        border: primaryDark.step9,
      },
      focus: {
        bg: primaryDark.step3,
        border: primaryDark.step10,
      },
      disabled: {
        bg: neutralDark.step2,
        border: neutralDark.step6,
      },
    },
    indicator: {
      color: primaryDark.step9,
      disabled: {
        color: neutralDark.step2,
      },
    },
  },
  input: {
    bg: secondaryDark.step3,
    border: secondaryDark.step3,
    color: secondaryDark.step12,
    placeholder: secondaryDark.step11,
    hover: {
      bg: secondaryDark.step4,
      border: secondaryDark.step4,
    },
    focus: {
      bg: secondaryDark.step3,
      border: secondaryDark.step6,
    },
    disabled: {
      bg: neutralDark.step5,
      border: neutralDark.step5,
      color: neutralDark.step10,
      placeholder: neutralDark.step10,
    },
    success: {
      border: successDark.step9,
    },
    warning: {
      border: warningDark.step9,
    },
    error: {
      border: dangerDark.step9,
    },
    icon: {
      color: secondaryDark.step11,
    },
  },
  link: {
    color: primaryDark.step10,
  },
  loading: {
    primary: {
      color: primaryDark.step11,
      bg: primaryDark.step8,
    },
    secondary: {
      color: secondaryDark.step11,
      bg: secondaryDark.step8,
    },
    success: {
      color: successDark.step11,
      bg: successDark.step8,
    },
    warning: {
      color: warningDark.step11,
      bg: warningDark.step8,
    },
    danger: {
      color: dangerDark.step11,
      bg: dangerDark.step8,
    },
  },
  radio: {
    bg: secondaryDark.step3,
    border: secondaryDark.step6,
    hover: {
      bg: secondaryDark.step4,
      border: secondaryDark.step6,
    },
    focus: {
      bg: secondaryDark.step3,
      border: secondaryDark.step7,
    },
    disabled: {
      bg: neutralDark.step2,
      border: neutralDark.step6,
    },
    active: {
      bg: primaryDark.step9,
      border: primaryDark.step9,
      hover: {
        bg: primaryDark.step10,
        border: primaryDark.step10,
      },
      focus: {
        bg: primaryDark.step9,
        border: primaryDark.step11,
      },
      disabled: {
        bg: neutralDark.step9,
        border: neutralDark.step9,
      },
    },
    indicator: {
      bg: primaryDark.step3,
      disabled: {
        bg: neutralDark.step1,
      },
    },
  },
  select: {
    bg: secondaryDark.step2,
    border: "transparent",
    radius: "4px",
    color: secondaryDark.step11,
    hover: {
      bg: secondaryDark.step4,
      border: secondaryDark.step4,
    },
    focus: {
      bg: secondaryDark.step3,
      border: secondaryDark.step6,
    },
    disabled: {
      bg: neutralDark.step5,
      color: neutralDark.step5,
      placeholder: neutralDark.step10,
    },
    success: {
      border: successDark.step9,
    },
    warning: {
      border: warningDark.step9,
    },
    error: {
      border: dangerDark.step9,
    },
    option: {
      bg: secondaryDark.step3,
      color: secondaryDark.step11,
    },
    icon: {
      color: secondaryDark.step11,
    },
  },
  switch: {
    base: {
      bg: secondaryDark.step6,
      disabled: {
        bg: neutralDark.step6,
      },
      active: {
        bg: primaryDark.step6,
        disabled: {
          bg: neutralDark.step6,
        },
      },
    },
    indicator: {
      bg: secondaryDark.step9,
      border: secondaryDark.step9,
      hover: {
        bg: secondaryDark.step10,
        border: secondaryDark.step10,
      },
      focus: {
        bg: secondaryDark.step9,
        border: secondaryDark.step11,
      },
      disabled: {
        bg: neutralDark.step9,
        border: neutralDark.step9,
      },
      active: {
        bg: primaryDark.step9,
        border: primaryDark.step9,
        hover: {
          bg: primaryDark.step10,
          border: primaryDark.step10,
        },
        focus: {
          bg: primaryDark.step9,
          border: primaryDark.step11,
        },
        disabled: {
          bg: neutralDark.step9,
          border: neutralDark.step9,
        },
      },
    },
    label: {
      color: secondaryDark.step12,
      disabled: {
        color: neutralDark.step9,
      },
    },
  },
  tag: {
    radius: "4px",
  },
  textarea: {
    bg: secondaryDark.step3,
    border: secondaryDark.step1,
    color: secondaryDark.step12,
    placeholder: secondaryDark.step11,
    hover: {
      bg: secondaryDark.step4,
      border: secondaryDark.step4,
    },
    focus: {
      bg: secondaryDark.step3,
      border: secondaryDark.step6,
    },
    disabled: {
      bg: neutralDark.step5,
      border: neutralDark.step5,
      placeholder: neutralDark.step10,
    },
    success: {
      border: successDark.step9,
    },
    warning: {
      border: warningDark.step9,
    },
    error: {
      border: dangerDark.step9,
    },
  },
  tooltip: {
    radius: "4px",
    icon: {
      color: primaryDark.step9,
    },
    content: {
      bg: secondaryDark.step6,
      color: secondaryDark.step12,
    },
  },
  // *** MOLECULES *** //
  addressDisplay: {
    color: secondaryDark.step11,
    icon: {
      color: primaryDark.step10,
    },
  },
  banner: {
    bg: infoDark.step9,
    border: infoDark.step9,
    color: secondaryDark.step12,
  },
  collapsibleCard: {
    outer: {
      bg: secondaryDark.step2,
      border: secondaryDark.step5,
    },
    inner: {
      bg: secondaryDarkA.step3,
      border: secondaryDarkA.step5,
    },
    trigger: {
      color: primaryDark.step11,
      hover: {
        color: primaryDark.step10,
      },
      focus: {
        color: primaryDark.step12,
      },
    },
  },
  dialog: {
    radius: "8px",
    overlay: {
      bg: secondaryDarkA.step4,
    },
    content: {
      bg: secondaryDark.step2,
      color: secondaryDark.step12,
    },
  },
  dropdown: {
    content: {
      primary: {
        bg: primaryDark.step3,
      },
      secondary: {
        bg: secondaryDark.step3,
      },
    },
    item: {
      primary: {
        bg: primaryDark.step3,
      },
      secondary: {
        bg: secondaryDark.step3,
      },
      focus: {
        primary: {
          bg: primaryDark.step5,
        },
        secondary: {
          bg: secondaryDark.step5,
        },
      },
      highlight: {
        primary: {
          bg: primaryDark.step4,
        },
        secondary: {
          bg: secondaryDark.step4,
        },
      },
      disabled: {
        color: neutralDark.step10,
      },
    },
    separator: {
      bg: secondaryDark.step12,
    },
    link: {
      color: secondaryDark.step12,
      hover: {
        bg: secondaryDark.step4,
        border: secondaryDark.step4,
      },
      disabled: {
        color: secondaryDark.step11,
      },
    },
  },
  fieldAlert: {
    bg: primaryDark.step3,
    border: primaryDark.step6,
    radius: "4px",
    warning: {
      bg: warningDark.step2,
      border: warningDark.step5,
      button: {
        bg: warningDark.step9,
        border: warningDark.step9,
        hover: {
          bg: warningDark.step9,
          border: warningDark.step9,
        },
        active: {
          bg: warningDark.step9,
          border: warningDark.step9,
        },
      },
    },
  },
  imageInput: {
    imageWrapper: {
      bg: secondaryDark.step2,
    },
    cancelIcon: {
      color: secondaryDark.step6,
    },
  },
  inputSelect: {
    bg: secondaryDark.step6,
    color: secondaryDark.step12,
    hover: {
      bg: secondaryDark.step7,
    },
    focus: {
      bg: secondaryDark.step6,
    },
    disabled: {
      bg: secondaryDark.step3,
    },
    selectBox: {
      bg: primaryDark.step6,
    },
  },
  navigationMenu: {
    root: {
      bg: secondaryDark.step2,
    },
    content: {
      bg: secondaryDark.step4,
      border: secondaryDark.step3,
    },
    baseItem: {
      color: secondaryDark.step9,
      hover: {
        bg: secondaryDark.step10,
      },
      focus: {
        bg: secondaryDark.step11,
      },
    },
    link: {
      active: {
        border: secondaryDark.step9,
        color: secondaryDark.step12,
      },
    },
  },
  tabs: {
    links: {
      color: secondaryDark.step2,
    },
    link: {
      color: secondaryDark.step9,
      hover: {
        color: secondaryDark.step10,
      },
      active: {
        border: secondaryDark.step9,
      },
    },
  },
  toast: {
    bg: secondaryDark.step3,
    border: secondaryDark.step5,
    radius: "4px",
    success: {
      bg: successDark.step3,
      border: successDark.step7,
    },
    warning: {
      bg: warningDark.step3,
      border: warningDark.step7,
    },
    error: {
      bg: dangerDark.step3,
      border: dangerDark.step7,
    },
    icon: {
      default: successDark.step9,
      success: successDark.step9,
      warning: warningDark.step9,
      error: dangerDark.step9,
    },
  },
};
