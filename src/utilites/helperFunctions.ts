const colors = [
  "#4285F4",
  "#EA4335",
  "#FBBC05",
  "#34A853",
  "#8E24AA"
];

export function getUSerColor(id: string){
  const idx= id.length % colors.length;
  return colors[idx]
}