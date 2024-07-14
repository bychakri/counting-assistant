import * as React from 'react';

import { NativeAudioViewProps } from './NativeAudio.types';

export default function NativeAudioView(props: NativeAudioViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
