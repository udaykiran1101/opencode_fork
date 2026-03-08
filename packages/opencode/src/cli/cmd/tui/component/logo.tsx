import { For, type JSX } from "solid-js"
import { useTheme, tint } from "@tui/context/theme"
import { logo, marks } from "@/cli/logo"
import { TextAttributes } from "@opentui/core"

const SHADOW_MARKER = new RegExp(`[${marks}]`)

export function Logo() {
  const { theme } = useTheme()

  // Edge colours updated to match your requested mapping
  const leftColor = "#39BAE6"   // Blue
  const rightColor = "#95C11F"  // Green
  const bottomColor = "#D2A6FF" // Purple

  const renderLine = (line: string, row: number, bold: boolean): JSX.Element[] => {
    const attrs = bold ? TextAttributes.BOLD : undefined
    const elements: JSX.Element[] = []

    const trimmed = line.trimEnd()
    const first = trimmed.search(/\S/)
    const last = trimmed.length - 1

    const gaps: number[] = []
    for (let i = first; i <= last; i++) {
      if (trimmed[i] === " ") gaps.push(i)
    }

    const gap1 = gaps[0] ?? -1
    const gap2 = gaps[gaps.length - 1] ?? -1

    const height = logo.left.length

    for (let col = 0; col < line.length; col++) {
      const ch = line[col]

      if (ch === " ") {
        elements.push(<text selectable={false}> </text>)
        continue
      }

      let color

      // Left beam: the first block of characters before the first space
      if (col < gap1) {
        color = leftColor
      }
      // Bottom beam: encompasses the very bottom solid rows, AND the inner top-facing section
      else if (row > height * 0.72 || (col > gap1 && col < gap2)) {
        color = bottomColor
      }
      // Right beam: everything else (typically the block after the last space, and the top tip)
      else {
        color = rightColor
      }

      elements.push(
        <text fg={color} attributes={attrs} selectable={false}>
          {ch}
        </text>
      )
    }

    return elements
  }

  return (
    <box>
      <For each={logo.left}>
        {(line, index) => (
          <box flexDirection="row" gap={1}>
            <box flexDirection="row">{renderLine(line, index(), false)}</box>
            <box flexDirection="row">
              {renderLine(logo.right[index()] ?? "", index(), true)}
            </box>
          </box>
        )}
      </For>
    </box>
  )
}
