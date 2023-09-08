import {
  ThemeOverrides,
  danger,
  dangerDark,
  dangerDarkBtn,
  defaultDarkTheme,
  neutral,
  neutralDark,
  primaryDarkBtn,
  secondaryDark,
  secondaryDarkA,
  secondaryDarkBtn,
  success,
  successDark,
  successDarkBtn,
  warning,
  warningDark,
  warningDarkBtn,
} from "@daohaus/ui";
import { sand, sandA, sandDark, sandDarkA } from "@radix-ui/colors";

export const pgDarkMono = {
  step1: "hsl(0, 0%, 100%)",
  step2: "hsl(0, 0%, 66%)",
  step3: "hsl(0, 0%, 22%)",
  step4: "hsl(0, 0%, 0%)",
  step5: "rgba(255, 0, 0, 0)",  
  step6: "rgba(0, 0, 0, 1)",  
  step7: "rgba(255, 255, 255, 1)",

};

export const pgDarkPrimaryBtn = {
  ...primaryDarkBtn,
  solid: {
    text: pgDarkMono.step1,
    bg: pgDarkMono.step5,
    border: pgDarkMono.step1,
    bgHover: pgDarkMono.step5,
    borderHover: pgDarkMono.step2,
    bgFocus: pgDarkMono.step2,
    borderFocus: pgDarkMono.step1,
    bgDisabled: pgDarkMono.step5,
    borderDisabled: pgDarkMono.step3,
  },
  ghost: {
    text: pgDarkMono.step1,
    bgHover: pgDarkMono.step4,
    borderFocus: pgDarkMono.step4,
    disabled: pgDarkMono.step4,
  },
};

export const pgDarkSecondaryBtn = {
  ...secondaryDarkBtn,
  solid: {
    text: pgDarkMono.step1,
    bg: pgDarkMono.step3,
    border: pgDarkMono.step3,
    bgHover: pgDarkMono.step2,
    borderHover: pgDarkMono.step2,
    bgFocus: pgDarkMono.step3,
    borderFocus: pgDarkMono.step1,
    bgDisabled: pgDarkMono.step3,
    borderDisabled: pgDarkMono.step3,
  },
  outline: {
    ...pgDarkPrimaryBtn.solid,
  },
};

const pgDarkFontFamily = {
  body: `'Calibre,Helvetica,Arial,sans-serif;', monospace`,
  header: `'Calibre,Helvetica,Arial,sans-serif;', monospace`,
  data: `'Ubuntu Mono', monospace`,
};

export const secondary = {
    step1: sandDark.sand1,
    step2: sandDark.sand1,
    step3: sandDark.sand1,
    step4: sandDark.sand1,
    step5: sandDark.sand1,
    step6: sandDark.sand1,
    step7: sandDark.sand1,
    step8: sandDark.sand1,
    step9: sandDark.sand1,
    step10: sandDark.sand1,
    step11: sandDark.sand1,
    step12: sandDark.sand1,
  };
  
  export const secondaryA = {
    step1: sandA.sandA1,
    step2: sandA.sandA1,
    step3: sandA.sandA1,
    step4: sandA.sandA1,
    step5: sandA.sandA1,
    step6: sandA.sandA1,
    step7: sandA.sandA1,
    step8: sandA.sandA1,
    step9: sandA.sandA1,
    step10: sandA.sandA1,
    step11: sandA.sandA1,
    step12: sandA.sandA1,
  };

export const pgDarkTheme: ThemeOverrides = {
  themeName: "pgdark",
  rootBgColor: "rgba(0,0,0,1)",
  rootFontColor: pgDarkMono.step1,
  secondary: { ...secondary },
  secondaryA: { ...secondaryA },
  border: {
    radius: "1px",
  },
  link: {
    color: sand.sand12,
    active: {
      border: sand.sand12,
      color: sand.sand12,
    },
  },
  navigationMenu: {
    root: {
      bg: pgDarkMono.step6,
    },
    content: {
      bg:  pgDarkMono.step6,
      border: pgDarkMono.step3,
    },
    baseItem: {
      color: pgDarkMono.step7,
      hover: {
        bg: pgDarkMono.step7,
      },
      focus: {
        bg: pgDarkMono.step7,
      },
    },
    link: {
      active: {
        border: pgDarkMono.step7,
        color: pgDarkMono.step7,
      },
    },
  },
  
  font: {
    family: pgDarkFontFamily,
    size: {
      xs: "1.2rem",
      sm: "1.4rem",
      md: "1.6rem",
      lg: "2rem",
      xl: "2.4rem",
      xxl: "3.2rem",
      xxxl: "4rem",
      xxxxl: "4.8rem",
    },
    weight: {
      extraLight: 200,
      light: 300,
      reg: 400,
      med: 500,
      bold: 700,
      black: 900,
    },
    lineHeight: "150%",
    letterSpacing: "1.5px",
  },
  field: {
    ...defaultDarkTheme.field,
    radius: "4px",
    inputFont: pgDarkFontFamily.data,
    labelFont: pgDarkFontFamily.header,
  },
  button: {
    primary: pgDarkPrimaryBtn,
    secondary: pgDarkSecondaryBtn,
    success: successDarkBtn,
    warning: warningDarkBtn,
    danger: dangerDarkBtn,
    radius: "4px",
  },
  card: {
    bg: secondary.step6,
    border: pgDarkMono.step7,
    radius: "8px",
  },
  input: {
    ...defaultDarkTheme.input,
    border: pgDarkMono.step5,
    bg: secondary.step3,
    color: pgDarkMono.step1,
    hover: {
      bg: secondary.step3,
      border: pgDarkMono.step1,
    },
    focus: {
      bg: secondary.step3,
      border: pgDarkMono.step1,
    },
  },
  inputSelect: {
    bg: secondary.step3,
    color: secondaryDark.step12,
    hover: {
      bg: secondary.step4,
    },
    focus: {
      bg: secondary.step5,
    },
    disabled: {
      bg: secondary.step2,
    },
    selectBox: {
      bg: secondary.step6,
    },
  },
  select: {
    bg: secondary.step2,
    border: 'transparent',
    radius: 1,
    color: pgDarkMono.step1,
    hover: {
      bg: secondary.step4,
      border: secondary.step4,
    },
    focus: {
      bg: secondary.step3,
      border: secondary.step6,
    },
    disabled: {
      bg: neutral.step5,
      color: neutral.step5,
      placeholder: neutral.step10,
    },
    success: {
      border: success.step9,
    },
    warning: {
      border: warning.step9,
    },
    error: {
      border: danger.step9,
    },
    option: {
      bg: secondary.step3,
      color: pgDarkMono.step1,
    },
    icon: {
      color: pgDarkMono.step1,
    },
  },
  textarea: {
    bg: secondary.step3,
    border: secondary.step1,
    color: secondary.step12,
    placeholder: secondary.step11,
    hover: {
      bg: secondary.step4,
      border: secondary.step4,
    },
    focus: {
      bg: secondary.step3,
      border: secondary.step6,
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
  dropdown: {
    ...defaultDarkTheme.dropdown,
    content: {
      primary: {
        bg: pgDarkMono.step5,
      },
      secondary: {
        bg: pgDarkMono.step5,
      },
    },
    item: {
      primary: {
        bg: "transparent",
      },
      secondary: {
        bg: pgDarkMono.step5,
      },
      focus: {
        primary: {
          bg: "transparent",
        },
        secondary: {
          bg: "transparent",
        },
      },
      highlight: {
        primary: {
          bg: pgDarkMono.step4,
        },
        secondary: {
          bg: pgDarkMono.step4,
        },
      },
      disabled: {
        color: pgDarkMono.step5,
      },
    },
  },
  toast: {
    ...defaultDarkTheme.toast,
    bg: pgDarkMono.step3,
    border: pgDarkMono.step5,
    success: {
      bg: pgDarkMono.step3,
      border: pgDarkMono.step5,
    },
  },
};
