import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DAYS, TIME_SLOTS, ScheduleData, Preset } from '../types';
import { Download, RotateCcw } from 'lucide-react';

interface GridProps {
  schedule: ScheduleData;
  presets: Preset[];
  selectedPresetId: string | null;
  isEraserActive: boolean;
  onUpdateSchedule: (newSchedule: ScheduleData) => void;
  onClearSchedule: () => void;
}

const Grid: React.FC<GridProps> = ({
  schedule,
  presets,
  selectedPresetId,
  isEraserActive,
  onUpdateSchedule,
  onClearSchedule,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  // Keep track of which cell started the drag to determine functionality if we add more complex selection later
  const startCellRef = useRef<{ day: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to get preset details
  const getPreset = useCallback(
    (id: string) => presets.find((p) => p.id === id),
    [presets]
  );

  // Apply the current tool (Preset or Eraser) to a specific cell
  const paintCell = useCallback(
    (dayIndex: number, timeIndex: number, currentSchedule: ScheduleData) => {
      const key = `${dayIndex}-${timeIndex}`;

      if (isEraserActive) {
        if (currentSchedule[key]) {
          const newSchedule = { ...currentSchedule };
          delete newSchedule[key];
          return newSchedule;
        }
      } else if (selectedPresetId) {
        if (currentSchedule[key] !== selectedPresetId) {
          return {
            ...currentSchedule,
            [key]: selectedPresetId,
          };
        }
      }
      return currentSchedule;
    },
    [isEraserActive, selectedPresetId]
  );

  const handleMouseDown = (dayIndex: number, timeIndex: number) => {
    // Only allow painting if left click
    setIsDragging(true);
    startCellRef.current = { day: dayIndex, time: timeIndex };
    
    // Paint the initial cell
    const newSchedule = paintCell(dayIndex, timeIndex, schedule);
    if (newSchedule !== schedule) {
      onUpdateSchedule(newSchedule);
    }
  };

  const handleMouseEnter = (dayIndex: number, timeIndex: number) => {
    if (!isDragging) return;
    
    // Performance optimization: Using functional update pattern isn't easy here because we need "current" props.
    // However, since we are updating the parent state, onUpdateSchedule will trigger a re-render.
    // In a production app with huge grids, we might use a ref for the schedule or useTransition.
    // Given 336 cells, React 18 is fast enough.
    
    const newSchedule = paintCell(dayIndex, timeIndex, schedule);
    if (newSchedule !== schedule) {
      onUpdateSchedule(newSchedule);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    startCellRef.current = null;
  };

  // Global mouse up handler to catch drags that end outside the grid
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        startCellRef.current = null;
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);


  const exportImage = () => {
     alert("Feature: Ideally this would use html2canvas to screenshot the .grid-container class!");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Header / Actions */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-20">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Weekly Schedule</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEraserActive 
                ? "Eraser Active: Drag across blocks to clear them." 
                : selectedPresetId 
                    ? `Paint Mode: Drag across blocks to fill with "${getPreset(selectedPresetId)?.name}".` 
                    : "Select an activity from the sidebar to start painting."}
          </p>
        </div>
        <div className="flex gap-3">
            <button
                onClick={onClearSchedule}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
                <RotateCcw className="w-4 h-4" />
                Clear Week
            </button>
           {/* Placeholder for export, functional but mocked */}
           <button
            onClick={exportImage}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto relative select-none grid-container"
      >
        <div className="min-w-[800px] pb-10">
            {/* Days Header */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
                <div className="p-3 bg-gray-50 text-xs font-semibold text-gray-400 border-r border-gray-200 flex items-center justify-center">
                    Time
                </div>
                {DAYS.map((day) => (
                    <div key={day} className="p-3 bg-gray-50 text-sm font-bold text-gray-700 text-center border-r border-gray-200 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Time Rows */}
            <div className="bg-white">
                {TIME_SLOTS.map((time, timeIndex) => (
                    <div key={time} className="grid grid-cols-[60px_repeat(7,1fr)] h-10 border-b border-gray-100">
                        {/* Time Label */}
                        <div className="text-[10px] text-gray-400 flex items-center justify-center border-r border-gray-100 bg-white font-mono sticky left-0 z-5">
                            {time}
                        </div>

                        {/* Day Cells */}
                        {DAYS.map((_, dayIndex) => {
                            const key = `${dayIndex}-${timeIndex}`;
                            const presetId = schedule[key];
                            const preset = presetId ? getPreset(presetId) : null;
                            const isHourStart = time.endsWith('00');
                            
                            return (
                                <div
                                    key={key}
                                    onMouseDown={() => handleMouseDown(dayIndex, timeIndex)}
                                    onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
                                    className={`
                                        relative border-r border-gray-100 last:border-r-0 cursor-crosshair transition-colors duration-75
                                        ${!preset && isHourStart ? 'border-t border-gray-100/50' : ''}
                                        ${preset ? preset.color : 'hover:bg-gray-50'}
                                    `}
                                >
                                    {/* Only show label if it's the start of a block (cell above is different) */}
                                    {preset && (schedule[`${dayIndex}-${timeIndex - 1}`] !== presetId) && (
                                        <div className={`absolute top-0.5 left-1 right-1 text-[10px] font-medium truncate ${preset.textColor} opacity-90 pointer-events-none`}>
                                            {preset.name}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Grid;
