import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { NativeAudioViewProps } from './NativeAudio.types';

const NativeView: React.ComponentType<NativeAudioViewProps> =
  requireNativeViewManager('NativeAudio');

export default function NativeAudioView(props: NativeAudioViewProps) {
  return <NativeView {...props} />;
}
