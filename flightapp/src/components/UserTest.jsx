import { useState } from 'react';
import { getUser, writeUser } from '../api/getuser';

export default function UserTest() {
  const [uid, setUid] = useState('test-user-1');
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);

  async function save() {
    await writeUser(uid, { name, updatedAt: Date.now() });
    setResult(await getUser(uid));
  }
  async function load() {
    setResult(await getUser(uid));
  }

  return (
    <div style={{display:'grid', gap:8}}>
      <input value={uid} onChange={e=>setUid(e.target.value)} placeholder="uid" />
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="name" />
      <div style={{display:'flex', gap:8}}>
        <button onClick={save}>Save</button>
        <button onClick={load}>Load</button>
      </div>
      <pre>{JSON.stringify(result, null, 2) || '—'}</pre>
    </div>
  );
}
