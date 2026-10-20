import React,{createRef} from 'react';
import {Tabs04,Breadcrumb04,StockTabValue} from '@follow-ui/react-seven';
const value:StockTabValue='pending';
const good=<><Tabs04 value={value} ref={createRef<HTMLDivElement>()} onValueChange={(next,details)=>{details.cancel();return false;}} triggerProps={{shipped:{ref:createRef<HTMLButtonElement>(),disabled:true}}}/><Tabs04 defaultValue="inventory" activationMode="manual" orientation="vertical"/><Breadcrumb04 ref={createRef<HTMLElement>()} linkProps={{library:{href:'#local',ref:createRef<HTMLAnchorElement>(),onClick:e=>e.preventDefault()}}}/></>;
// @ts-expect-error mutually exclusive ownership
const mix=<Tabs04 value="pending" defaultValue="inventory"/>;
// @ts-expect-error fixed source values
const wrong=<Tabs04 value="other"/>;
// @ts-expect-error fixed content cannot be replaced
const child=<Tabs04>other</Tabs04>;
// @ts-expect-error owned native button type
const type=<Tabs04 triggerProps={{pending:{type:'submit'}}}/>;
// @ts-expect-error no arbitrary original segments
const segments=<Breadcrumb04 segments={[]}/>;
// @ts-expect-error fixed source link text
const link=<Breadcrumb04 linkProps={{library:{children:'other'}}}/>;
// @ts-expect-error div root rejects SVG ref
const ref=<Tabs04 ref={createRef<SVGSVGElement>()}/>;
// @ts-expect-error fixed breadcrumb content
const html=<Breadcrumb04 dangerouslySetInnerHTML={{__html:'x'}}/>;
void[good,mix,wrong,child,type,segments,link,ref,html];
