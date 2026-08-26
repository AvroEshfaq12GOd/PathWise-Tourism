package com.example

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.location.Location
import android.location.LocationManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.CalendarContract
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.JavascriptInterface
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.example.ui.theme.MyApplicationTheme
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

class MainActivity : ComponentActivity() {

  private var pendingGeolocationCallback: Pair<String?, GeolocationPermissions.Callback?>? = null

  private val requestPermissionLauncher = registerForActivityResult(
    ActivityResultContracts.RequestMultiplePermissions()
  ) { permissions ->
    val fineGranted = permissions[android.Manifest.permission.ACCESS_FINE_LOCATION] ?: false
    val coarseGranted = permissions[android.Manifest.permission.ACCESS_COARSE_LOCATION] ?: false
    Log.d("PathWise", "Location permissions result: fine=$fineGranted, coarse=$coarseGranted")
    
    pendingGeolocationCallback?.let { (origin, callback) ->
      if (fineGranted || coarseGranted) {
        callback?.invoke(origin, true, false)
      } else {
        callback?.invoke(origin, false, false)
      }
      pendingGeolocationCallback = null
    }
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      WebView.setWebContentsDebuggingEnabled(true)
    }

    checkLocationPermissions()

    setContent {
      MyApplicationTheme {
        PathWiseScreen(
          onRequestLocationPermission = { origin, callback ->
            pendingGeolocationCallback = Pair(origin, callback)
            requestPermissionLauncher.launch(
              arrayOf(
                android.Manifest.permission.ACCESS_FINE_LOCATION,
                android.Manifest.permission.ACCESS_COARSE_LOCATION
              )
            )
          }
        )
      }
    }
  }

  private fun checkLocationPermissions() {
    val fineLocation = ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
    val coarseLocation = ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION)
    if (fineLocation != PackageManager.PERMISSION_GRANTED && coarseLocation != PackageManager.PERMISSION_GRANTED) {
      requestPermissionLauncher.launch(
        arrayOf(
          android.Manifest.permission.ACCESS_FINE_LOCATION,
          android.Manifest.permission.ACCESS_COARSE_LOCATION
        )
      )
    }
  }
}

class WebAppInterface(private val context: Context) {
  @JavascriptInterface
  fun hasLocationPermission(): Boolean {
    val fine = ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_FINE_LOCATION)
    val coarse = ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_COARSE_LOCATION)
    return fine == PackageManager.PERMISSION_GRANTED || coarse == PackageManager.PERMISSION_GRANTED
  }

  @JavascriptInterface
  fun getLastKnownLocation(): String {
    return try {
      val fine = ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_FINE_LOCATION)
      val coarse = ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_COARSE_LOCATION)
      if (fine != PackageManager.PERMISSION_GRANTED && coarse != PackageManager.PERMISSION_GRANTED) {
        return "{\"hasLocation\": false}"
      }
      val lm = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
      var bestLoc: Location? = null
      val providers = lm?.getProviders(true) ?: emptyList()
      for (provider in providers) {
        val l = lm?.getLastKnownLocation(provider) ?: continue
        if (bestLoc == null || l.accuracy < bestLoc.accuracy) {
          bestLoc = l
        }
      }
      if (bestLoc != null) {
        "{\"hasLocation\": true, \"lat\": ${bestLoc.latitude}, \"lng\": ${bestLoc.longitude}, \"accuracy\": ${bestLoc.accuracy}}"
      } else {
        "{\"hasLocation\": false}"
      }
    } catch (e: Exception) {
      "{\"hasLocation\": false}"
    }
  }

  @JavascriptInterface
  fun openExternalUrl(url: String): Boolean {
    return try {
      val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      context.startActivity(intent)
      true
    } catch (e: Exception) {
      Log.e("PathWise", "Error opening external URL: $url", e)
      false
    }
  }

  @JavascriptInterface
  fun openGoogleMapsDirections(destinationName: String, lat: Double, lng: Double): Boolean {
    return try {
      val gmmIntentUri = Uri.parse("geo:$lat,$lng?q=" + Uri.encode("$destinationName, Sri Lanka"))
      val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri).apply {
        setPackage("com.google.android.apps.maps")
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      if (mapIntent.resolveActivity(context.packageManager) != null) {
        context.startActivity(mapIntent)
        true
      } else {
        val webUri = Uri.parse("https://www.google.com/maps/dir/?api=1&destination=$lat,$lng&travelmode=driving")
        val webIntent = Intent(Intent.ACTION_VIEW, webUri).apply {
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(webIntent)
        true
      }
    } catch (e: Exception) {
      openExternalUrl("https://www.google.com/maps/dir/?api=1&destination=$lat,$lng&travelmode=driving")
    }
  }

  @JavascriptInterface
  fun addCalendarEvent(
    title: String,
    description: String,
    location: String,
    startDateIso: String,
    endDateIso: String,
    allDay: Boolean
  ): Boolean {
    return try {
      val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US).apply {
        timeZone = TimeZone.getTimeZone("Asia/Colombo")
      }
      val startMillis = try {
        sdf.parse(startDateIso)?.time ?: System.currentTimeMillis()
      } catch (e: Exception) {
        System.currentTimeMillis()
      }
      val endMillis = try {
        sdf.parse(endDateIso)?.time ?: (startMillis + 24 * 60 * 60 * 1000)
      } catch (e: Exception) {
        startMillis + 24 * 60 * 60 * 1000
      }

      val intent = Intent(Intent.ACTION_INSERT).apply {
        data = CalendarContract.Events.CONTENT_URI
        putExtra(CalendarContract.Events.TITLE, title)
        putExtra(CalendarContract.Events.DESCRIPTION, description)
        putExtra(CalendarContract.Events.EVENT_LOCATION, location)
        putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, startMillis)
        putExtra(CalendarContract.EXTRA_EVENT_END_TIME, endMillis)
        putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, allDay)
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      context.startActivity(intent)
      true
    } catch (e: Exception) {
      Log.e("PathWiseCalendar", "Error launching calendar intent: ${e.message}")
      false
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun PathWiseScreen(
  onRequestLocationPermission: (String?, GeolocationPermissions.Callback?) -> Unit = { _, _ -> }
) {
  var webViewRef by remember { mutableStateOf<WebView?>(null) }
  var canGoBack by remember { mutableStateOf(false) }

  BackHandler(enabled = canGoBack) {
    webViewRef?.let { wv ->
      if (wv.canGoBack()) {
        wv.goBack()
      }
    }
  }

  val lifecycleOwner = LocalLifecycleOwner.current
  DisposableEffect(lifecycleOwner, webViewRef) {
    val observer = LifecycleEventObserver { _, event ->
      when (event) {
        Lifecycle.Event.ON_RESUME -> webViewRef?.onResume()
        Lifecycle.Event.ON_PAUSE -> webViewRef?.onPause()
        Lifecycle.Event.ON_DESTROY -> {
          webViewRef?.destroy()
          webViewRef = null
        }
        else -> {}
      }
    }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose {
      lifecycleOwner.lifecycle.removeObserver(observer)
    }
  }

  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(Color(0xFFF0F4F8))
      .statusBarsPadding()
      .navigationBarsPadding()
  ) {
    AndroidView(
      modifier = Modifier.fillMaxSize(),
      factory = { context ->
        WebView(context).apply {
          layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
          )

          setBackgroundColor(0xFFF0F4F8.toInt())

          // Let WebView handle its native rendering without forcing offscreen hardware layer rendernode allocation
          setLayerType(View.LAYER_TYPE_NONE, null)

          val cookieManager = CookieManager.getInstance()
          cookieManager.setAcceptCookie(true)
          cookieManager.setAcceptThirdPartyCookies(this, true)

          settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(true)
            builtInZoomControls = false
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            mediaPlaybackRequiresUserGesture = false
            textZoom = 100
            setGeolocationEnabled(true)
          }

          addJavascriptInterface(WebAppInterface(context), "AndroidLocationBridge")

          webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
              consoleMessage?.let {
                Log.d("PathWise", "${it.message()} -- line ${it.lineNumber()}")
              }
              return true
            }

            override fun onGeolocationPermissionsShowPrompt(
              origin: String?,
              callback: GeolocationPermissions.Callback?
            ) {
              val fineGranted = ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.ACCESS_FINE_LOCATION
              ) == PackageManager.PERMISSION_GRANTED
              val coarseGranted = ContextCompat.checkSelfPermission(
                context,
                android.Manifest.permission.ACCESS_COARSE_LOCATION
              ) == PackageManager.PERMISSION_GRANTED

              if (fineGranted || coarseGranted) {
                callback?.invoke(origin, true, false)
              } else {
                onRequestLocationPermission(origin, callback)
              }
            }
          }

          webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
              view: WebView?,
              request: WebResourceRequest?
            ): Boolean {
              val url = request?.url?.toString() ?: return false
              // Allow local asset navigation and scripts to run internally
              if (url.startsWith("file:///android_asset/") || url.startsWith("file://") || url.startsWith("about:blank") || url.startsWith("javascript:")) {
                return false
              }
              // Launch all external URLs (Google Maps, Calendar, HTTPS sites, GEO intents) outside the WebView
              return try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                  addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(intent)
                true
              } catch (e: Exception) {
                Log.e("PathWise", "Failed to launch external intent for: $url", e)
                false
              }
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
              super.onPageStarted(view, url, favicon)
              canGoBack = view?.canGoBack() == true
            }

            override fun onPageFinished(view: WebView?, url: String?) {
              super.onPageFinished(view, url)
              canGoBack = view?.canGoBack() == true
            }

            override fun onReceivedError(
              view: WebView?,
              request: WebResourceRequest?,
              error: WebResourceError?
            ) {
              super.onReceivedError(view, request, error)
            }

            override fun onRenderProcessGone(
              view: WebView?,
              detail: RenderProcessGoneDetail?
            ): Boolean {
              webViewRef?.let {
                (it.parent as? ViewGroup)?.removeView(it)
                it.destroy()
              }
              webViewRef = null
              return true
            }
          }

          loadUrl("file:///android_asset/index.html")
          webViewRef = this
        }
      },
      update = { wv ->
        webViewRef = wv
      }
    )
  }
}
