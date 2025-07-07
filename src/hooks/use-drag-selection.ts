"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface Position {
  x: number
  y: number
}

interface SelectionBox {
  startX: number
  startY: number
  endX: number
  endY: number
}

interface UseDragSelectionProps {
  items: Array<{ id: string | number; [key: string]: any }>
  selectedItems: string[]
  onSelectionChange: (selectedIds: string[]) => void
  getItemId: (item: any) => string
  disabled?: boolean
}

export function useDragSelection({
  items,
  selectedItems,
  onSelectionChange,
  getItemId,
  disabled = false,
}: UseDragSelectionProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null)
  const [shiftPressed, setShiftPressed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startPosition = useRef<Position>({ x: 0, y: 0 })
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map())
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null)
  const isAutoScrolling = useRef<boolean>(false)
  const currentMouseY = useRef<number>(0)
  const currentSelectionBox = useRef<SelectionBox | null>(null)

  // Prevent text selection when shift is pressed
  useEffect(() => {
    if (shiftPressed) {
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"
    } else {
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
    }

    return () => {
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
    }
  }, [shiftPressed])

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    // Only start auto-scroll if it's not already running
    if (isAutoScrolling.current) {
      return
    }

    isAutoScrolling.current = true

    autoScrollInterval.current = setInterval(() => {
      // Get current mouse position from the last mouse event
      const windowHeight = window.innerHeight
      const scrollThreshold = 50

      // We'll use a simple approach: check if we should scroll based on stored mouse position
      const shouldScrollDown =
        currentMouseY.current >= windowHeight - scrollThreshold
      const shouldScrollUp = currentMouseY.current <= scrollThreshold

      let scrollSpeed = 0
      if (shouldScrollDown) {
        scrollSpeed = 10
      } else if (shouldScrollUp) {
        scrollSpeed = -10
      }

      if (scrollSpeed !== 0) {
        // Try multiple scroll methods
        window.scrollBy(0, scrollSpeed)
        document.documentElement.scrollTop += scrollSpeed
        document.body.scrollTop += scrollSpeed

        // Also try scrolling the container if it exists
        if (containerRef.current) {
          const scrollableParent =
            containerRef.current.closest("[data-scroll-container]") ||
            containerRef.current.closest(".overflow-auto") ||
            containerRef.current.closest(".overflow-y-auto") ||
            document.body
          if (scrollableParent) {
            scrollableParent.scrollTop += scrollSpeed
          }
        }
      }
    }, 100)
  }, [])

  const stopAutoScroll = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current)
      autoScrollInterval.current = null
    }
    isAutoScrolling.current = false
  }, [])

  // Track shift key state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.shiftKey) {
        setShiftPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift" || !e.shiftKey) {
        setShiftPressed(false)
        // If we're currently selecting and shift is released, stop selection
        if (isSelecting) {
          stopAutoScroll()
          currentSelectionBox.current = null
          setIsSelecting(false)
          setSelectionBox(null)
        }
      }
    }

    const handleWindowBlur = () => {
      // Reset shift state when window loses focus
      setShiftPressed(false)
      if (isSelecting) {
        setIsSelecting(false)
        setSelectionBox(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("keyup", handleKeyUp, true)
    window.addEventListener("blur", handleWindowBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("keyup", handleKeyUp, true)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [isSelecting, stopAutoScroll])

  const isElementInSelection = (element: HTMLElement, box: SelectionBox) => {
    const rect = element.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()

    if (!containerRect) return false

    // Adjust coordinates relative to container
    const adjustedBox = {
      left: Math.min(box.startX, box.endX) + containerRect.left,
      right: Math.max(box.startX, box.endX) + containerRect.left,
      top: Math.min(box.startY, box.endY) + containerRect.top,
      bottom: Math.max(box.startY, box.endY) + containerRect.top,
    }

    // Check if element intersects with selection box
    return (
      rect.left < adjustedBox.right &&
      rect.right > adjustedBox.left &&
      rect.top < adjustedBox.bottom &&
      rect.bottom > adjustedBox.top
    )
  }

  const updateSelection = useCallback(
    (box: SelectionBox) => {
      const selectedIds = new Set<string>(selectedItems) // Start with current selection
      const itemsInBox = new Set<string>()

      // Find all items currently in the selection box
      items.forEach((item) => {
        const itemId = getItemId(item)
        const element = itemRefs.current.get(itemId)

        if (element && isElementInSelection(element, box)) {
          itemsInBox.add(itemId)
        }
      })

      // Determine if this is a reverse drag (dragging from bottom-right to top-left)
      const isReverseDrag =
        (box.endX < box.startX && box.endY < box.startY) ||
        (Math.abs(box.endX - box.startX) < 10 && box.endY < box.startY)

      // If reverse drag, remove items that are in the box
      if (isReverseDrag) {
        itemsInBox.forEach((itemId) => {
          selectedIds.delete(itemId)
        })
      } else {
        // Normal drag, add items in box
        itemsInBox.forEach((itemId) => {
          selectedIds.add(itemId)
        })
      }

      onSelectionChange(Array.from(selectedIds))
    },
    [items, selectedItems, getItemId, onSelectionChange]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !shiftPressed || e.button !== 0) return

      // Prevent all default behaviors
      e.preventDefault()
      e.stopPropagation()

      // Prevent text selection immediately
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"

      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return

      const startX = e.clientX - containerRect.left
      const startY = e.clientY - containerRect.top

      startPosition.current = { x: startX, y: startY }
      setIsSelecting(true)
      setSelectionBox({
        startX,
        startY,
        endX: startX,
        endY: startY,
      })
    },
    [disabled, shiftPressed]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !containerRef.current) return

      e.preventDefault()

      currentMouseY.current = e.clientY

      const containerRect = containerRef.current.getBoundingClientRect()
      const currentX = e.clientX - containerRect.left
      const currentY = e.clientY - containerRect.top

      const box = {
        startX: startPosition.current.x,
        startY: startPosition.current.y,
        endX: currentX,
        endY: currentY,
      }

      currentSelectionBox.current = box

      const windowHeight = window.innerHeight
      const scrollThreshold = 100
      const mouseY = e.clientY

      // Check if we should scroll
      const shouldScrollDown =
        mouseY > windowHeight - scrollThreshold || mouseY > windowHeight * 0.8
      const shouldScrollUp =
        mouseY < scrollThreshold || mouseY < windowHeight * 0.2

      // Only change auto-scroll state if needed
      if (shouldScrollDown || shouldScrollUp) {
        if (!isAutoScrolling.current) {
          startAutoScroll()
        }
      } else {
        if (isAutoScrolling.current) {
          stopAutoScroll()
        }
      }

      setSelectionBox(box)
      updateSelection(box)
    },
    [isSelecting, updateSelection, startAutoScroll, stopAutoScroll]
  )

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return

    stopAutoScroll()
    currentSelectionBox.current = null
    setIsSelecting(false)
    setSelectionBox(null)
  }, [isSelecting, stopAutoScroll])

  // Attach global mouse events when selecting
  useEffect(() => {
    if (isSelecting) {
      // Prevent text selection during drag
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("keyup", handleMouseUp) // Also stop on any key release
    }

    return () => {
      // Restore text selection
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""

      // Only stop auto-scroll when actually cleaning up (not re-running)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("keyup", handleMouseUp)
    }
  }, [isSelecting, handleMouseMove, handleMouseUp])

  const registerItemRef = useCallback(
    (itemId: string, element: HTMLElement | null) => {
      if (element) {
        itemRefs.current.set(itemId, element)
      } else {
        itemRefs.current.delete(itemId)
      }
    },
    []
  )

  const getSelectionBoxStyle = (): React.CSSProperties | undefined => {
    if (!selectionBox || !isSelecting) return undefined

    const left = Math.min(selectionBox.startX, selectionBox.endX)
    const top = Math.min(selectionBox.startY, selectionBox.endY)
    const width = Math.abs(selectionBox.endX - selectionBox.startX)
    const height = Math.abs(selectionBox.endY - selectionBox.startY)

    return {
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      border: `2px dashed #3b82f6`,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderRadius: "4px",
      pointerEvents: "none",
      zIndex: 1000,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      animation: "fadeInScale 0.1s ease-out",
    }
  }

  return {
    containerRef,
    registerItemRef,
    handleMouseDown,
    isSelecting,
    selectionBox,
    getSelectionBoxStyle,
    shiftPressed,
  }
}
