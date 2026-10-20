import {useId, useState} from 'react';
import {RadioGroup03, RadioGroup04, RadioGroup05, RadioGroup06, type RadioGroup04Value} from '@follow-ui/react-seven';
import '@follow-ui/react-seven/styles.css';

export function PlanExample({allowPremium = true}: {allowPremium?: boolean}) {
  const formId = useId();
  const [plan, setPlan] = useState<RadioGroup04Value | null>('starter');
  return <>
    <form id={formId} onSubmit={event => event.preventDefault()}>
      <RadioGroup03 name="theme" />
      <RadioGroup04 name="plan" value={plan} onValueChange={(next) => {
        if (next === 'premium' && !allowPremium) return false;
        setPlan(next);
      }} />
      <RadioGroup05 name="workspace" defaultValue="2" />
      <button type="reset">Reset native fields</button>
    </form>
    <RadioGroup06 name="project" form={formId} />
  </>;
}
