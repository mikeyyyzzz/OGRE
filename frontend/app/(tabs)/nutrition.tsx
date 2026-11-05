
import React from 'react';
import ModuleScreen from '../../src/components/common/ModuleScreen';

export default function NutritionScreen() {
  return (
    <ModuleScreen
      title="FUEL"
      subtitle="Your nutrition command center. Track what you eat and understand what your body needs."
      icon="restaurant"
      features={[
        'Daily Calorie Tracker',
        'Protein, Carbs and Fats',
        'Food Database',
        'Breakfast, Lunch and Dinner',
        'Custom Food Entry',
        'Saved Meals',
        'Water Intake',
        'Nutrition History',
      ]}
    />
  );
}
