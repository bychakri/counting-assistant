package expo.modules.nativeaudio

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import androidx.core.app.ActivityCompat
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

val REQUEST_RECORD_AUDIO_PERMISSION = 200
val permissions = arrayOf(Manifest.permission.RECORD_AUDIO)
const val SOUND_LEVEL_EVENT = "onSoundLevel"

class NativeAudioModule : Module() {
  private val sampleRate = 44100
  private val bufferSize = AudioRecord.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('NativeAudio')` in JavaScript.
    Name("NativeAudio")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    Events(SOUND_LEVEL_EVENT)


    // Defines a JavaScript function that starts live audio processing from the Android microphone and prints the amplitude.
    AsyncFunction("startLiveAudioProcessing") {
      val context:Context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      val activity:Activity = appContext.currentActivity ?: throw Exceptions.ReactContextLost()
      if (ActivityCompat.checkSelfPermission(
          context,
          Manifest.permission.RECORD_AUDIO
        ) != PackageManager.PERMISSION_GRANTED
      ) {
        ActivityCompat.requestPermissions(activity, permissions, REQUEST_RECORD_AUDIO_PERMISSION)
        // TODO: Consider calling
        //    ActivityCompat#requestPermissions
        // here to request the missing permissions, and then overriding
        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
        //                                          int[] grantResults)
        // to handle the case where the user grants the permission. See the documentation
        // for ActivityCompat#requestPermissions for more details.
      } else {

      }
      val audioRecord =  AudioRecord(
      MediaRecorder.AudioSource.MIC,
      sampleRate,
      AudioFormat.CHANNEL_IN_MONO,
      AudioFormat.ENCODING_PCM_16BIT,
      bufferSize
      )

      val buffer = ShortArray(bufferSize)
      audioRecord.startRecording()

      while (true) {
        val readSize = audioRecord.read(buffer, 0, bufferSize)
        if (readSize > 0) {
          var amplitude = 0
          val total = buffer.sum()
          val avg = total / readSize
          for (i in 0 until readSize) {
            val sample = buffer[i].toInt()
            sendEvent(SOUND_LEVEL_EVENT, mapOf(
                "Amplitude" to sample,
            ))
          }
          // val bufferString = buffer.joinToString(",")
          // sendEvent(SOUND_LEVEL_EVENT, mapOf(
          //     "Amplitude" to avg,
          //     "ReadSize" to readSize
          // ))
        }
      }
    }
    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(NativeAudioView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: NativeAudioView, prop: String ->
        println(prop)
      }
    }
  }

}
