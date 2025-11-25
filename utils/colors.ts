export const PRESET_COLORS = [
  { bg: 'bg-red-200', text: 'text-red-900', border: 'border-red-400' },
  { bg: 'bg-orange-200', text: 'text-orange-900', border: 'border-orange-400' },
  { bg: 'bg-amber-200', text: 'text-amber-900', border: 'border-amber-400' },
  { bg: 'bg-yellow-200', text: 'text-yellow-900', border: 'border-yellow-400' },
  { bg: 'bg-lime-200', text: 'text-lime-900', border: 'border-lime-400' },
  { bg: 'bg-green-200', text: 'text-green-900', border: 'border-green-400' },
  { bg: 'bg-emerald-200', text: 'text-emerald-900', border: 'border-emerald-400' },
  { bg: 'bg-teal-200', text: 'text-teal-900', border: 'border-teal-400' },
  { bg: 'bg-cyan-200', text: 'text-cyan-900', border: 'border-cyan-400' },
  { bg: 'bg-sky-200', text: 'text-sky-900', border: 'border-sky-400' },
  { bg: 'bg-blue-200', text: 'text-blue-900', border: 'border-blue-400' },
  { bg: 'bg-indigo-200', text: 'text-indigo-900', border: 'border-indigo-400' },
  { bg: 'bg-violet-200', text: 'text-violet-900', border: 'border-violet-400' },
  { bg: 'bg-purple-200', text: 'text-purple-900', border: 'border-purple-400' },
  { bg: 'bg-fuchsia-200', text: 'text-fuchsia-900', border: 'border-fuchsia-400' },
  { bg: 'bg-pink-200', text: 'text-pink-900', border: 'border-pink-400' },
  { bg: 'bg-rose-200', text: 'text-rose-900', border: 'border-rose-400' },
  { bg: 'bg-slate-300', text: 'text-slate-900', border: 'border-slate-500' },
];

export const getRandomColor = () => {
  return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
};
