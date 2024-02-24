import type { Meta, StoryObj } from '@storybook/react';

import StudySetPreview from '.';

const meta: Meta<typeof StudySetPreview> = {
  component: StudySetPreview
};

export default meta;
type Story = StoryObj<typeof StudySetPreview>;

export const Default: Story = {
  render: () => <StudySetPreview authorId='123' authorImage={null} authorName='John Doe' id='123' termsCount={2} title='Example StudySet' />,
};