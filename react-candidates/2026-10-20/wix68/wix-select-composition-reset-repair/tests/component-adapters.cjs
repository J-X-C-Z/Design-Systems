"use strict";
// Test-only wrappers expose each REAL Select15 slot through a button-ref-shaped harness.
// Its two siblings remain mounted and disabled; dedicated composition tests exercise active peers.
exports.createTestComponents=(React,api)=>{
 const result={...api},h=React.createElement;
 for(const slot of ['small','standard','large']){
  const name='Select15'+slot[0].toUpperCase()+slot.slice(1);
  result[name]=React.forwardRef((props,ref)=>{
   const slots={small:{disabled:true},standard:{disabled:true},large:{disabled:true}};
   slots[slot]={...props,triggerRef:ref};
   return h('div',{'data-fixture-slot':slot},h(api.Select15,slots));
  });result[name].displayName='TestReal'+name;
 }
 return result;
};
exports.targetContainer=root=>{const host=root.querySelector('[data-fixture-slot]');return host?host.querySelector('.wix-sc-slot[data-control="'+host.dataset.fixtureSlot+'"]'):root;};
exports.targetTriggers=root=>[...root.querySelectorAll('[role=combobox]')].filter(node=>{const host=node.closest('[data-fixture-slot]');return !host||node.closest('.wix-sc-slot')?.dataset.control===host.dataset.fixtureSlot;});
