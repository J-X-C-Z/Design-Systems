import * as React from 'react';
import { Select34 } from '@studio/wix-native-multiple';
import '@studio/wix-native-multiple/styles.css';

/** Local-only planning example. Nothing is sent to a service or persisted. */
export function MealBrief() {
  const [preferences, setPreferences] = React.useState<readonly string[]>([]);
  const [brief, setBrief] = React.useState<string | null>(null);
  return <form aria-label="Meal planning brief" onSubmit={event => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) return;
    const data = new FormData(event.currentTarget);
    setBrief(`Local brief: ${data.getAll('preferences').join(', ')}`);
  }} onReset={() => { setPreferences([]); setBrief(null); }}>
    <h2>Plan a shared lunch</h2>
    <p>Choose preferences for this local meal brief. Nothing is sent or saved.</p>
    <Select34 name="preferences" required value={preferences} onChange={event => {
      setPreferences(Array.from(event.currentTarget.selectedOptions, option => option.value));
      setBrief(null);
    }} />
    <p aria-live="polite">{preferences.length} preferences selected</p>
    <button type="submit">Prepare local brief</button>{' '}
    <button type="reset">Start again</button>
    <output aria-live="polite">{brief ?? 'No brief prepared.'}</output>
  </form>;
}
