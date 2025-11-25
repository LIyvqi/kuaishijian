import React, { useState } from 'react';
import { Plus, Trash2, Eraser, Edit2, X, Check } from 'lucide-react';
import { Preset } from '../types';
import { getRandomColor, PRESET_COLORS } from '../utils/colors';

interface SidebarProps {
  presets: Preset[];
  selectedPresetId: string | null;
  onSelectPreset: (id: string | null) => void;
  onAddPreset: (preset: Preset) => void;
  onDeletePreset: (id: string) => void;
  onUpdatePreset: (preset: Preset) => void;
  isEraserActive: boolean;
  onToggleEraser: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  onAddPreset,
  onDeletePreset,
  onUpdatePreset,
  isEraserActive,
  onToggleEraser,
}) => {
  const [newPresetName, setNewPresetName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const colorSet = getRandomColor();
    const newPreset: Preset = {
      id: crypto.randomUUID(),
      name: newPresetName.trim(),
      color: colorSet.bg,
      textColor: colorSet.text,
    };

    onAddPreset(newPreset);
    setNewPresetName('');
  };

  const startEditing = (preset: Preset) => {
    setEditingId(preset.id);
    setEditName(preset.name);
    setConfirmDeleteId(null); // Cancel any pending delete
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEditing = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (preset && editName.trim()) {
      onUpdatePreset({ ...preset, name: editName.trim() });
    }
    setEditingId(null);
  };

  const initiateDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
    // Reset confirmation state after 3 seconds if not clicked
    setTimeout(() => {
        setConfirmDeleteId(current => current === id ? null : current);
    }, 3000);
  };

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Block Time</h1>
        <p className="text-sm text-gray-500">Plan your week, block by block.</p>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Tools */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tools</h2>
          <button
            onClick={onToggleEraser}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              isEraserActive
                ? 'bg-gray-800 text-white shadow-md transform scale-[1.02]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eraser className="w-5 h-5 mr-3" />
            <span className="font-medium">Eraser</span>
          </button>
        </div>

        {/* Presets List */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Activities</h2>
          <div className="space-y-2">
            {presets.map((preset) => {
              const isSelected = selectedPresetId === preset.id && !isEraserActive;
              const isConfirming = confirmDeleteId === preset.id;

              return (
                <div
                    key={preset.id}
                    className={`group flex items-center p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                        ? 'ring-2 ring-blue-500 ring-offset-1 border-transparent shadow-md transform scale-[1.02]'
                        : 'border-transparent hover:bg-gray-50'
                    } ${preset.color}`}
                    onClick={() => {
                        if (editingId !== preset.id) onSelectPreset(preset.id);
                    }}
                >
                    {editingId === preset.id ? (
                        <div className="flex items-center flex-1 w-full gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 bg-white/50 px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEditing(preset.id);
                                    if (e.key === 'Escape') cancelEditing();
                                }}
                            />
                            <button onClick={() => saveEditing(preset.id)} className="p-1 hover:bg-black/10 rounded">
                                <Check className="w-4 h-4 text-green-700" />
                            </button>
                            <button onClick={cancelEditing} className="p-1 hover:bg-black/10 rounded">
                                <X className="w-4 h-4 text-red-700" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={`flex-1 font-medium ${preset.textColor} truncate`}>
                            {preset.name}
                            </div>
                            <div className={`flex items-center gap-1 transition-opacity ${isSelected || isConfirming ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isConfirming ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeletePreset(preset.id);
                                            setConfirmDeleteId(null);
                                        }}
                                        className="px-2 py-1.5 rounded bg-red-500 text-white text-xs font-bold shadow-sm hover:bg-red-600 transition-colors animate-in fade-in slide-in-from-right-1 duration-200"
                                    >
                                        Confirm
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(preset);
                                            }}
                                            className={`p-1.5 rounded-md hover:bg-black/10 ${preset.textColor}`}
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => initiateDelete(preset.id, e)}
                                            className={`p-1.5 rounded-md hover:bg-red-500 hover:text-white transition-colors ${preset.textColor}`}
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
              );
            })}
            
            {presets.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm">No activities yet.</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Preset */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="New Activity..."
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newPresetName.trim()}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;