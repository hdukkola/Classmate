import purpleBadge from "figma:asset/6d91ebc6a87be065b260df912a7c60dd5889df5d.png";
import blueBadge from "figma:asset/1a2e8189b14061359627791e18bd5c9e534b8f9a.png";
import greenBadge from "figma:asset/59481cf76a82549490f6436db266045534b45de4.png";
import redBadge from "figma:asset/cca270c30e7b9cd321aea9996d3752bc7955d30c.png";

// Function to get grade color based on percentage
export const getGradeColor = (grade: number): string => {
  if (grade >= 94) return "#6b3894"; // Purple
  if (grade >= 85) return "#3B82F6"; // Blue
  if (grade >= 70) return "#10B981"; // Green
  return "#EF4444"; // Red
};

// Function to get grade badge image based on percentage
export const getGradeBadge = (grade: number): string => {
  if (grade >= 94) return purpleBadge;
  if (grade >= 85) return blueBadge;
  if (grade >= 70) return greenBadge;
  return redBadge;
};

// Function to get text color for badge (white for all badges)
export const getBadgeTextColor = (grade: number): string => {
  return "#ffffff"; // White text for all badges
};

// Function to get GPA color based on GPA value
export const getGPAColor = (gpa: number): string => {
  if (gpa >= 3.7) return "#6b3894"; // Purple - Excellent (94+)
  if (gpa >= 3.0) return "#3B82F6"; // Blue - Great (85-93)
  if (gpa >= 2.0) return "#10B981"; // Green - Fair (70-84)
  return "#EF4444"; // Red - Needs improvement (<70)
};

// Function to get GPA badge image based on GPA value
export const getGPABadge = (gpa: number): string => {
  if (gpa >= 3.7) return purpleBadge;
  if (gpa >= 3.0) return blueBadge;
  if (gpa >= 2.0) return greenBadge;
  return redBadge;
};

// Function to get text color for GPA badge (white for all badges)
export const getGPABadgeTextColor = (gpa: number): string => {
  return "#ffffff"; // White text for all badges
};

// Function to get letter grade from percentage
export const getLetterGrade = (grade: number): string => {
  if (grade >= 94) return "A";
  if (grade >= 85) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
};

// Function to get glow color for grade badges
export const getGradeGlow = (grade: number): string => {
  if (grade >= 94) return "rgba(107, 56, 148, 0.5)"; // Purple
  if (grade >= 85) return "rgba(59, 130, 246, 0.5)"; // Blue
  if (grade >= 70) return "rgba(16, 185, 129, 0.5)"; // Green
  return "rgba(239, 68, 68, 0.5)"; // Red
};

// Function to get glow color for GPA badges
export const getGPAGlow = (gpa: number): string => {
  if (gpa >= 3.7) return "rgba(107, 56, 148, 0.5)"; // Purple
  if (gpa >= 3.0) return "rgba(59, 130, 246, 0.5)"; // Blue
  if (gpa >= 2.0) return "rgba(16, 185, 129, 0.5)"; // Green
  return "rgba(239, 68, 68, 0.5)"; // Red
};

// Function to convert hex color to rgba with opacity
export const hexToRgba = (hex: string, opacity: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(107, 56, 148, ${opacity})`; // Default purple
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};