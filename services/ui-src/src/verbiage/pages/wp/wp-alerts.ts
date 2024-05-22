export default {
  initiative: {
    title:
      "This alert will disappear once you add initiatives that meet the topic requirements",
    description: [
      {
        type: "p",
        content:
          "Initiatives must meet the following requirements at least once across all the initiatives:",
      },
      {
        type: "ul",
        content: "",
        children: [
          {
            type: "li",
            content: "Transitions and transition coordination services",
          },
          {
            type: "li",
            content: "Housing-related supports",
          },
          {
            type: "li",
            content: "Quality measurement and improvement",
          },
          {
            type: "li",
            content: "Self-direction (if applicable)",
          },
          {
            type: "li",
            content: "Tribal (if applicable)",
          },
        ],
      },
      {
        type: "p",
        content:
          'To correct this, ensure you answer the 2 questions at the bottom of "State or Territory-Specific Initiatives Instructions" (the previous page), and add at least one initiative for each of these topics on this screen, below. This alert will disappear once they’re met. This alert will reappear if you closed out the only initiative of a required topic.',
      },
    ],
  },
};
