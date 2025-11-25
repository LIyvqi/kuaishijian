import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Grid from './components/Grid';
import { Preset, ScheduleData } from './types';

// Initial Demo Data
const INITIAL_PRESETS: Preset[] = [
  { id: '1', name: 'Deep Work', color: 'bg-red-200', textColor: 'text-red-900' },
  { id: '2', name: 'Meeting', color: 'bg-blue-200', textColor: 'text-blue-900' },
  { id: '3', name: 'Exercise', color: 'bg-green-200', textColor: 'text-green-900' },
  { id: '4', name: 'Reading', color: 'bg-amber-200', textColor: 'text-amber-900' },
  { id: '5', name: 'Sleep', color: 'bg-slate-300', textColor: 'text-slate-900' },
];

const App: React.FC = () => {
  // State initialization with LocalStorage check
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('blocktime_presets');
    return saved ? JSON.parse(saved) : INITIAL_PRESETS;
  });

  const [schedule, setSchedule] = useState<ScheduleData>(() => {
    // Changed key to v2 to reset schedule for the new 9:00-22:00 time range
    const saved = localStorage.getItem('blocktime_schedule_v2');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isEraserActive, setIsEraserActive] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('blocktime_presets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('blocktime_schedule_v2', JSON.stringify(schedule));
  }, [schedule]);

  // Handlers
  const handleSelectPreset = (id: string | null) => {
    setSelectedPresetId(id);
    setIsEraserActive(false);
  };

  const handleToggleEraser = () => {
    setIsEraserActive(!isEraserActive);
    if (!isEraserActive) {
      setSelectedPresetId(null);
    }
  };

  const handleAddPreset = (preset: Preset) => {
    setPresets([...presets, preset]);
    // Automatically select the new preset
    handleSelectPreset(preset.id);
  };

  const handleDeletePreset = (id: string) => {
    // UI handles confirmation now, so we just proceed
    setPresets(presets.filter((p) => p.id !== id));
    if (selectedPresetId === id) {
      setSelectedPresetId(null);
    }
  };

  const handleUpdatePreset = (updatedPreset: Preset) => {
    setPresets(presets.map((p) => (p.id === updatedPreset.id ? updatedPreset : p)));
  };

  const handleClearSchedule = () => {
    if (window.confirm('Clear the entire week schedule?')) {
      setSchedule({});
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-900 font-sans">
      <Sidebar
        presets={presets}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onAddPreset={handleAddPreset}
        onDeletePreset={handleDeletePreset}
        onUpdatePreset={handleUpdatePreset}
        isEraserActive={isEraserActive}
        onToggleEraser={handleToggleEraser}
      />
      <Grid
        schedule={schedule}
        presets={presets}
        selectedPresetId={selectedPresetId}
        isEraserActive={isEraserActive}
        onUpdateSchedule={setSchedule}
        onClearSchedule={handleClearSchedule}
      />
    </div>
  );
};

export default App;