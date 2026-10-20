import React,{createContext,useContext,useMemo,forwardRef} from 'react';
export const THEMES=Object.freeze(['echo','bloom','neuro','follow','wix','maigawara','goons']);
const Context=createContext({theme:'follow',mode:'light',density:'comfortable',reduceMotion:false});
export const useSevenTheme=()=>useContext(Context);
export const SevenThemeProvider=forwardRef(function SevenThemeProvider({theme='follow',mode,density='comfortable',reduceMotion=false,children,className='',...props},ref){
 const system=THEMES.includes(theme)?theme:'follow';
 const resolvedMode=mode==='dark'||mode==='light'?mode:system==='neuro'?'dark':'light';
 const resolvedDensity=density==='compact'?'compact':'comfortable';
 const value=useMemo(()=>({theme:system,mode:resolvedMode,density:resolvedDensity,reduceMotion:!!reduceMotion}),[system,resolvedMode,resolvedDensity,reduceMotion]);
 return <Context.Provider value={value}><div {...props} ref={ref} className={`fr7 ${className}`.trim()} data-system={system} data-mode={resolvedMode} data-density={resolvedDensity} data-motion={reduceMotion?'off':'on'}>{children}</div></Context.Provider>;
});
