// Only for inherited interaction matrices: exercise opt-in enabled 19 and optional 21.
// availability.cjs separately tests untouched defaults, override removal and true native flags.
exports.createInteractiveAPI=(React,raw)=>Object.fromEntries(Object.entries(raw).map(([name,C])=>[name,['Select19','Select21'].includes(name)?React.forwardRef((props,ref)=>React.createElement(C,{...(name==='Select19'?{disabled:false}:{required:false}),...props,ref})):C]));
