/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Subjects } from './pages/Subjects';
import { Tasks } from './pages/Tasks';
import { Study } from './pages/Study';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="study" element={<Study />} />
        </Route>
      </Routes>
    </Router>
  );
}
