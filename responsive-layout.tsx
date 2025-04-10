"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { GripVertical } from "lucide-react"

const ResponsiveGridLayout = WidthProvider(Responsive)

const Block = ({ id, color, children }: { id: string; color: string; children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full border rounded-md shadow-sm overflow-hidden">
      <div className={`p-2 text-white font-medium flex items-center justify-between ${color}`}>
        <span>Block {id}</span>
        <div className="drag-handle cursor-move">
          <GripVertical size={18} />
        </div>
      </div>
      <div className="flex-1 p-4 bg-white overflow-auto">{children}</div>
    </div>
  )
}

export default function ResponsiveLayout() {
  const [isMounted, setIsMounted] = useState(false)

  const [layouts, setLayouts] = useState({
    lg: [
      { i: "1", x: 0, y: 0, w: 3, h: 12, minW: 2 },
      { i: "2", x: 3, y: 0, w: 6, h: 12, minW: 3 }, 
      { i: "3", x: 9, y: 0, w: 3, h: 12, minW: 2 }, 
    ],
    md: [
      { i: "1", x: 0, y: 0, w: 3, h: 12, minW: 2 },
      { i: "2", x: 3, y: 0, w: 6, h: 12, minW: 3 },
      { i: "3", x: 9, y: 0, w: 3, h: 12, minW: 2 },
    ],
    sm: [
      { i: "1", x: 0, y: 0, w: 12, h: 6 },
      { i: "2", x: 0, y: 6, w: 12, h: 6 },
      { i: "3", x: 0, y: 12, w: 12, h: 6 },
    ],
    xs: [
      { i: "1", x: 0, y: 0, w: 12, h: 6 },
      { i: "2", x: 0, y: 6, w: 12, h: 6 },
      { i: "3", x: 0, y: 12, w: 12, h: 6 },
    ],
  })

  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    const layout = currentLayout || allLayouts.lg

    const blocks = layout.map((item: any) => ({
      id: item.i,
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
    }))

    const updatedLayout = applyVerticalStackingRule(blocks, layout)

    if (updatedLayout) {
      setLayouts({ ...allLayouts, lg: updatedLayout })
    } else {
      setLayouts(allLayouts)
    }
  }

  const applyVerticalStackingRule = (blocks: any[], layout: any[]) => {
    const blocksByX: Record<number, any[]> = {}

    blocks.forEach((block) => {
      if (!blocksByX[block.x]) {
        blocksByX[block.x] = []
      }
      blocksByX[block.x].push(block)
    })

    const verticalStacks = Object.values(blocksByX).filter(
      (stack) => stack.length >= 2 && stack.some((b) => b.id === "1") && stack.some((b) => b.id === "3"),
    )

    if (verticalStacks.length > 0) {
      const stackedBlocks = verticalStacks[0]
      const block2 = blocks.find((b) => b.id === "2")

      if (block2) {
        const newLayout = layout.map((item) => {
          if (item.i === "2") {
            return { ...item, w: 8 }
          } else if (stackedBlocks.some((b) => b.id === item.i)) {
            const stackIndex = stackedBlocks.findIndex((b) => b.id === item.i)
            return {
              ...item,
              w: 4,
              h: 6,
              y: stackIndex * 6,
            }
          }
          return item
        })

        return newLayout
      }
    }

    return null
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-screen flex items-center justify-center">Loading layout...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Responsive Draggable & Resizable Layout</h1>
      <p className="mb-6 text-gray-600">
        Drag blocks to rearrange them. Resize by dragging the edges. Stack blocks 1 and 3 vertically to activate the 2/3
        split layout.
      </p>

      <div className="border rounded-lg p-2 bg-gray-50">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
          rowHeight={30}
          width={1200}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
        >
          <div key="1">
            <Block id="1" color="bg-blue-500">
              1
            </Block>
          </div>
          <div key="2">
            <Block id="2" color="bg-green-500">
             2
            </Block>
          </div>
          <div key="3">
            <Block id="3" color="bg-purple-500">
              2
            </Block>
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  )
}
