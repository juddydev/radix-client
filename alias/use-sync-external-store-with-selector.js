// @ts-nocheck

import g from "react"

function n(a, b) {
  return (a === b && (0 !== a || 1 / a === 1 / b)) || (a !== a && b !== b)
}
var p = "function" === typeof Object.is ? Object.is : n,
  q = g.useSyncExternalStore,
  r = g.useRef,
  t = g.useEffect,
  u = g.useMemo,
  v = g.useDebugValue

export function useSyncExternalStoreWithSelector(a, b, e, l, h) {
  var c = r(null)
  var f
  if (null === c.current) {
    f = { hasValue: !1, value: null }
    c.current = f
  } else {
    f = c.current
  }
  c = u(() => {
    function a(a) {
      if (!c) {
        c = !0
        d = a
        a = l(a)
        if (void 0 !== h && f.hasValue) {
          var b = f.value
          if (h(b, a)) return (k = b)
        }
        return (k = a)
      }
      b = k
      if (p(d, a)) return b
      var e = l(a)
      if (void 0 !== h && h(b, e)) return b
      d = a
      return (k = e)
    }
    var c = !1,
      d,
      k,
      m = void 0 === e ? null : e
    return [() => a(b()), null === m ? void 0 : () => a(m())]
  }, [b, e, l, h])
  var d = q(a, c[0], c[1])
  t(() => {
    f.hasValue = !0
    f.value = d
  }, [d])
  v(d)
  return d
}

export default useSyncExternalStoreWithSelector
