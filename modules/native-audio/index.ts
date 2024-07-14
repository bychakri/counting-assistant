import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to NativeAudio.web.ts
// and on native platforms to NativeAudio.ts
import NativeAudioModule from './src/NativeAudioModule';
import NativeAudioView from './src/NativeAudioView';
import { ChangeEventPayload, NativeAudioViewProps } from './src/NativeAudio.types';

// Get the native constant value.
export const PI = NativeAudioModule.PI;

export function hello(): string {
  return NativeAudioModule.hello();
}

export function startLiveAudioProcessing(): void {
  NativeAudioModule.startLiveAudioProcessing();
}

export async function setValueAsync(value: string) {
  return await NativeAudioModule.setValueAsync(value);
}

const emitter = new EventEmitter(NativeAudioModule ?? NativeModulesProxy.NativeAudio);

emitter.addListener("onSoundLevel", (event) => {
  console.log(event);
});

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { NativeAudioView, NativeAudioViewProps, ChangeEventPayload };
