import React,{useId,useState}from'react';
import{RadioGroup11,RadioGroup12,RadioGroup13,Switch19}from'@follow-ui/react-seven';

export default function RelayWorkshop(){
 const uid=useId(),formId=`relay168-${uid}`;
 const[device,setDevice]=useState('1'),[ownedDevice,setOwnedDevice]=useState(true),[sync,setSync]=useState(true),[ownedSync,setOwnedSync]=useState(true);
 const[reject,setReject]=useState(false),[disabled,setDisabled]=useState(false),[readOnly,setReadOnly]=useState(false),[mounted,setMounted]=useState(true),[revision,setRevision]=useState(0),[events,setEvents]=useState(0),[receipt,setReceipt]=useState('No local field record yet.');
 const proposeDevice=next=>{setEvents(n=>n+1);if(reject)return false;if(ownedDevice)setDevice(next);};
 const proposeSync=next=>{setEvents(n=>n+1);if(reject)return false;if(ownedSync)setSync(next);};
 const resetParent=()=>{setDevice('1');setSync(true);setRevision(n=>n+1);setReceipt('Parent defaults restored; a fresh native field set is mounted.');};
 return <section className="follow168-relay-workshop" aria-labelledby={`relay168-title-${uid}`}>
  <div className="relay168-heading"><div className="relay168-index" aria-hidden="true">04<span>LOCAL CIRCUITS</span></div><div><p className="relay168-eyebrow">FOLLOW / RELAY WORKSHOP</p><h2 id={`relay168-title-${uid}`}>A choice.<br/><em>A visible consequence.</em></h2><p className="relay168-lead">Four small controls, laid out like a working bench. Choose a plan, a membership or a device. Auto sync changes its local caption; it never connects to a service.</p></div></div>
  <div className="relay168-controls" aria-label="Local demonstration controls">
   <label><input type="checkbox" checked={ownedDevice} onChange={e=>setOwnedDevice(e.target.checked)}/>Parent owns device</label>
   <label><input type="checkbox" checked={ownedSync} onChange={e=>setOwnedSync(e.target.checked)}/>Parent owns sync</label>
   <label><input type="checkbox" checked={reject} onChange={e=>setReject(e.target.checked)}/>Reject proposals</label>
   <label><input type="checkbox" checked={disabled} onChange={e=>setDisabled(e.target.checked)}/>Disable specimens</label>
   <label><input type="checkbox" checked={readOnly} onChange={e=>setReadOnly(e.target.checked)}/>Read-only sync</label>
  </div>
  <div className="relay168-actions"><button type="button" onClick={()=>setDevice(null)}>Clear parent device</button><button type="button" onClick={()=>setDevice('2')}>Parent selects disabled Tablet</button><button type="button" onClick={()=>setSync(v=>!v)}>Parent toggles sync</button><button type="button" onClick={()=>setMounted(v=>!v)}>{mounted?'Unmount four controls':'Remount four controls'}</button><button type="button" onClick={resetParent}>Restore parent defaults</button></div>
  <div className="relay168-board">
   <form id={formId} className="relay168-form" onSubmit={e=>{e.preventDefault();setReceipt(JSON.stringify([...new FormData(e.currentTarget)]));}}>
    <div className="relay168-plate"><div className="relay168-plate-label"><span>01 / PLAN</span><small>RADIO 11</small></div><h3>Words carry the choice.</h3><p>Whole text cards. Real names. The circle stays visually clipped, and keyboard focus still gets an outline.</p>{mounted?<RadioGroup11 key={revision} name="plan" disabled={disabled} onValueChange={()=>{setEvents(n=>n+1);if(reject)return false;}}/>:<p className="relay168-absent">Plan field is unmounted.</p>}</div>
    <div className="relay168-plate relay168-membership"><div className="relay168-plate-label"><span>02 / MEMBERSHIP</span><small>RADIO 12</small></div><h3>A different kind of card.</h3><p>Centered symbols above the labels, with the actual 20px radio below. The original descriptions stay intact.</p>{mounted?<RadioGroup12 key={revision} name="membership" disabled={disabled} onValueChange={()=>{setEvents(n=>n+1);if(reject)return false;}}/>:<p className="relay168-absent">Membership field is unmounted.</p>}</div>
    <div className="relay168-plate relay168-sync"><div className="relay168-plate-label"><span>04 / SYNC</span><small>SWITCH 19</small></div><h3>State, spoken plainly.</h3><p>The caption and polite status follow the committed owner. Refused proposals leave the current state intact.</p>{mounted?<Switch19 key={revision} name="autoSync" value="enabled" checked={ownedSync?sync:undefined} disabled={disabled} readOnly={readOnly} onCheckedChange={proposeSync}/>:<p className="relay168-absent">Sync field is unmounted.</p>}<p className="relay168-owner" data-relay168-sync-owner>Parent sync: {String(sync)} / {ownedSync?'controlled':'released'}</p></div>
    <div className="relay168-readout"><span className="relay168-record-label">NATIVE FORM RECORD</span><div className="relay168-form-actions"><button type="submit">Read local FormData</button><button type="reset">Native field reset</button></div><p data-relay168-receipt role="status">{receipt}</p></div>
   </form>
   <div className="relay168-plate relay168-device"><div className="relay168-plate-label"><span>03 / DEVICE</span><small>RADIO 13</small></div><h3>The fieldset lives outside.</h3><p>Five source devices, linked back to the form by its real form attribute. Tablet remains disabled, even when the parent explicitly owns that value.</p>{mounted?<RadioGroup13 key={revision} name="device" form={formId} value={ownedDevice?device:undefined} disabled={disabled} onValueChange={proposeDevice}/>:<p className="relay168-absent">Device field is unmounted.</p>}<p className="relay168-owner" data-relay168-device-owner>Parent device: {device??'none'} / {ownedDevice?'controlled':'released'}</p><p className="relay168-device-note">Disabled choices do not enter FormData. A parent value can stay visible without becoming interactive.</p></div>
  </div>
  <div className="relay168-footer"><strong data-relay168-events>{events} local proposals</strong><p>Prices, memberships and devices are fixed source examples, not verified offers or hardware facts. Reset changes form fields, not this proposal counter. No purchase, account update, device operation or synchronization happens. Browser and assistive-technology acceptance is still pending.</p></div>
 </section>;
}
