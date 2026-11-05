
import React from 'react';
import ModuleScreen from '../../src/components/common/ModuleScreen';

export default function WorkoutsScreen() {
  return (
    <ModuleScreen
      title="TRAIN"
      subtitle="Build strength. Track every rep. Beat your previous performance."
      icon="barbell"
      features={[
        'Exercise Library',
        'Workout Plans',
        'Push / Pull / Legs',
        'Custom Workout Builder',
        'Sets, Reps and Weights',
        'Rest Timer',
        'Workout History',
        'Personal Records',
        'Progressive Overload',
      ]}
    />
  );
}
