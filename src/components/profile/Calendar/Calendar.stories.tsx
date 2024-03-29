import type { Meta, StoryObj } from "@storybook/react";

import Calendar from ".";

const meta: Meta<typeof Calendar> = {
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => <Calendar activity={[]} />,
};

export const WithActivity: Story = {
  render: () => {
    const activityDate1 = new Date();
    const activityDate2 = new Date();

    activityDate1.setDate(new Date().getDate() + 2);
    activityDate2.setDate(new Date().getDate() - 1);

    return (
      <Calendar
        activity={[
          { id: "123", date: activityDate1, userId: "123" },
          { id: "123", date: activityDate2, userId: "123" },
        ]}
      />
    );
  },
};
