import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { Button } from "~/components/ui/button"

const meta = {
  title: "shadcn-ui/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: "Primary",
  },
}
