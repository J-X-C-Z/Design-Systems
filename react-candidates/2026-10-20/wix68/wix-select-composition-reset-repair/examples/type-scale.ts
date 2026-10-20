/** Full-source local typography example; intentionally not an npm runtime export. */
export type TypeFamily = 'serif' | 'sans' | 'mono';
export type TypeWeight = 'regular' | 'medium' | 'bold';
export type TypeLeading = 'compact' | 'comfortable' | 'generous';
export type SmallTypeSize = '12' | '14' | '16';
export type StandardTypeSize = '18' | '20' | '24';
export type LargeTypeSize = '28' | '32' | '40';
export interface TypeScaleSettings { readonly family: TypeFamily; readonly weight: TypeWeight; readonly leading: TypeLeading; readonly small: SmallTypeSize; readonly standard: StandardTypeSize; readonly large: LargeTypeSize }
export const typeScaleFamilies = Object.freeze({serif:'Georgia, "Times New Roman", serif',sans:'Arial, Helvetica, sans-serif',mono:'"Courier New", Courier, monospace'});
export const typeScaleWeights = Object.freeze({regular:400,medium:500,bold:700});
export const typeScaleLeadings = Object.freeze({compact:1.2,comfortable:1.5,generous:1.8});
export const typeScaleSizes = Object.freeze({small:Object.freeze(['12','14','16'] as const),standard:Object.freeze(['18','20','24'] as const),large:Object.freeze(['28','32','40'] as const)});
export function createTypeScale(settings: TypeScaleSettings) {
  if(!settings || typeof settings!=='object' || Array.isArray(settings))throw new TypeError('Type scale settings must be a record.');
  const keys=['family','weight','leading','small','standard','large'] as const;
  const allowed:Record<typeof keys[number],readonly string[]>={family:['serif','sans','mono'],weight:['regular','medium','bold'],leading:['compact','comfortable','generous'],small:typeScaleSizes.small,standard:typeScaleSizes.standard,large:typeScaleSizes.large};
  for(const key of keys)if(typeof settings[key]!=='string'||!allowed[key].includes(settings[key]))throw new TypeError('Unsupported type scale '+key+'.');
  const snapshot=Object.freeze({family:settings.family,weight:settings.weight,leading:settings.leading,small:settings.small,standard:settings.standard,large:settings.large});
  const fontFamily=typeScaleFamilies[snapshot.family],fontWeight=typeScaleWeights[snapshot.weight],lineHeight=typeScaleLeadings[snapshot.leading];
  const sizes=Object.freeze({small:Number(snapshot.small),standard:Number(snapshot.standard),large:Number(snapshot.large)});
  const content=['/* Local typography scale. Uses installed fonts; no network font loading. */',':root {',`  --studio-type-family: ${fontFamily};`,`  --studio-type-weight: ${fontWeight};`,`  --studio-type-leading: ${lineHeight};`,`  --studio-type-small: ${sizes.small}px;`,`  --studio-type-standard: ${sizes.standard}px;`,`  --studio-type-large: ${sizes.large}px;`,'}','', '.studio-type-small, .studio-type-standard, .studio-type-large {','  font-family: var(--studio-type-family);','  font-weight: var(--studio-type-weight);','  line-height: var(--studio-type-leading);','}',...(['small','standard','large'] as const).map(size=>`.studio-type-${size} { font-size: var(--studio-type-${size}); }`),''].join('\n');
  return Object.freeze({filename:`studio-type-${snapshot.family}-${snapshot.weight}-${snapshot.leading}-${sizes.small}-${sizes.standard}-${sizes.large}.css`,mime:'text/css' as const,content,settings:snapshot,fontFamily,fontWeight,lineHeight,sizes});
}
