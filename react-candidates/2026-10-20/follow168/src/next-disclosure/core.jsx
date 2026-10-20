import {useLayoutEffect,useRef,useState} from 'react';
const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((v,i)=>v===b[i]):Object.is(a,b);
const clone=value=>Array.isArray(value)?value.slice():value;
export function useRequestedState({ id, value: ownerValue, defaultValue, normalize, disabled, onChange, validProposal }) {
  const controlled = ownerValue !== undefined;
  const [stored, setStored] = useState(() => clone(defaultValue));
  const [pending, setPending] = useState(null);
  const live = useRef(null), mounted = useRef(false), sequence = useRef(0), ownerEpoch = useRef(0);
  const previous = useRef({ controlled, raw: clone(ownerValue), value: normalize(controlled ? ownerValue : stored) });
  const raw = !controlled && previous.current.controlled ? previous.current.value : controlled ? ownerValue : stored;
  const effective = normalize(raw);
  useLayoutEffect(() => { mounted.current = true; return () => { mounted.current = false; sequence.current++; }; }, []);
  useLayoutEffect(() => {
    if (controlled !== previous.current.controlled || controlled && !same(ownerValue, previous.current.raw)) ownerEpoch.current++;
    live.current = { id, controlled, value: clone(effective), disabled: !!disabled, normalize, onChange, validProposal };
    previous.current = { controlled, raw: clone(ownerValue), value: clone(effective) };
    if (!controlled && !same(stored, effective)) setStored(clone(effective));
    if (pending) {
      if (pending.sequence === sequence.current && pending.ownerEpoch === ownerEpoch.current && !controlled && !pending.controlled && !disabled && (!validProposal || validProposal(pending.next, effective, pending.reason))) setStored(clone(normalize(pending.next)));
      setPending(null);
    }
  });
  function request(next, reason, event) {
    const start = live.current;
    if (!mounted.current || !start || start.disabled) return 'blocked';
    next = start.normalize(next);
    if (same(next, start.value)) return 'same';
    const serial = ++sequence.current, epoch = ownerEpoch.current;
    const result = start.onChange?.(clone(next), { id, previousValue: clone(start.value), controlled: start.controlled, reason, event });
    const now = live.current;
    if (!mounted.current || sequence.current !== serial || !now || epoch !== ownerEpoch.current) return 'owner';
    if (now.disabled || now.validProposal && !now.validProposal(next, now.value, reason)) return 'blocked';
    if (result === false) return 'veto';
    if (start.controlled || now.controlled) return 'controlled';
    setPending({ next: clone(next), sequence: serial, ownerEpoch: epoch, controlled: start.controlled, reason });
    return 'pending';
  }
  return { value: effective, request, live, mounted };
}

export function useCollectionFocus(root, enabledValues, selected) {
  const [roving, setRoving] = useState(null);
  const focused = useRef(null), externalEpoch = useRef(0), ownedEpoch = useRef(0);
  const effectiveRoving = enabledValues.includes(roving) ? roving : enabledValues.includes(selected) ? selected : enabledValues[0] ?? null;
  useLayoutEffect(() => {
    const node = root.current, doc = node?.ownerDocument;
    if (!doc) return;
    const track = event => {
      if (!node.contains(event.target)) externalEpoch.current++;
      else if (event.target.hasAttribute('data-value')) { focused.current = event.target; ownedEpoch.current = externalEpoch.current; }
    };
    doc.addEventListener('focusin', track);
    return () => doc.removeEventListener('focusin', track);
  }, []);
  useLayoutEffect(() => {
    const node = root.current, old = focused.current, doc = node?.ownerDocument;
    if (!node || !old || node.contains(old) && !old.disabled) return;
    if (externalEpoch.current !== ownedEpoch.current || doc.activeElement !== doc.body && doc.activeElement !== doc.documentElement && doc.activeElement !== old) return;
    const next = [...node.querySelectorAll('button[data-value]:not(:disabled)')].find(button => button.dataset.value === effectiveRoving);
    focused.current = null;
    if (next) next.focus();
  });
  return { roving: effectiveRoving, focus(event) { focused.current = event.currentTarget; ownedEpoch.current = externalEpoch.current; setRoving(event.currentTarget.dataset.value); }, setRoving };
}

