"use client"

import { useLayoutEffect } from "react"
import { O_STORY_MEASURE_JS } from "@/lib/oStoryMeasure"

/** After a client navigation the inline measure script in OStoryExplainer does not run (React
 *  inserts it, the browser skips it), so this runs the same source once the story is mounted. */
export function OStoryMeasure() {
  useLayoutEffect(() => {
    const w = window as unknown as { __oStoryMeasure?: () => void }
    if (w.__oStoryMeasure) w.__oStoryMeasure()
    else new Function(O_STORY_MEASURE_JS)()
  }, [])
  return null
}
