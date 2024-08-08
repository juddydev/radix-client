import {
  ATTR_LOADING_EAGER,
  DEFAULT_GRID_IMG_LOAD_EAGER_COUNT,
} from "~/lib/const"

export function getImageLoadingPriority(
  index: number,
  maxEagerLoadCount = DEFAULT_GRID_IMG_LOAD_EAGER_COUNT,
) {
  return index < maxEagerLoadCount ? ATTR_LOADING_EAGER : undefined
}
