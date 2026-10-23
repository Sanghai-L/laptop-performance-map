package app.laptopmap.offline;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.ConsoleMessage;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/** Offline assets only: external references always open in the user's browser. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String BASE = "https://" + HOST + "/assets/site/";
    private static final String ONLINE = "https://cpu-field-guide-sanghai.songngao764.chatgpt.site/";
    private static final int BACKGROUND = Color.rgb(247,248,244);
    private WebView web;
    private ProgressBar progress;
    private boolean errorShown;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(BACKGROUND);
        getWindow().setNavigationBarColor(BACKGROUND);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(BACKGROUND);
        root.setOnApplyWindowInsetsListener((v,insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(bars.left,bars.top,bars.right,bars.bottom);
            } else v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());
            return insets;
        });
        progress = new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal);
        progress.setMax(100);
        root.addView(progress,new LinearLayout.LayoutParams(-1,(int)(2*getResources().getDisplayMetrics().density)));
        try { web = new WebView(this); }
        catch (RuntimeException unavailable) { setContentView(root); showError(); return; }
        web.setBackgroundColor(BACKGROUND);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setUserAgentString(settings.getUserAgentString()+" LaptopPerformanceMap/1.0");
        web.setWebViewClient(new LocalClient());
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView view,int value) {
                progress.setProgress(value); progress.setVisibility(value==100?View.GONE:View.VISIBLE);
            }
            @Override public boolean onConsoleMessage(ConsoleMessage message) {
                if (message.messageLevel()==ConsoleMessage.MessageLevel.ERROR)
                    android.util.Log.e("LaptopMap",message.message()+" @"+message.lineNumber());
                return true;
            }
            @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean gesture,Message result) {
                if (!gesture) return false;
                final WebView popup = new WebView(MainActivity.this);
                popup.getSettings().setAllowFileAccess(false);
                popup.getSettings().setAllowContentAccess(false);
                popup.setWebViewClient(new WebViewClient() {
                    @Override public boolean shouldOverrideUrlLoading(WebView ignored,WebResourceRequest request) {
                        openExternal(request.getUrl()); popup.destroy(); return true;
                    }
                    @Override public WebResourceResponse shouldInterceptRequest(WebView ignored,WebResourceRequest request) {
                        return blocked();
                    }
                });
                ((WebView.WebViewTransport)result.obj).setWebView(popup); result.sendToTarget(); return true;
            }
        });
        root.addView(web,new LinearLayout.LayoutParams(-1,0,1));
        setContentView(root);
        root.requestApplyInsets();
        if (state==null || web.restoreState(state)==null) {
            String last=getPreferences(MODE_PRIVATE).getString("last",BASE+"index.html");
            web.loadUrl(isLocal(Uri.parse(last))?last:BASE+"index.html");
        }
        if (Build.VERSION.SDK_INT>=33) getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
            android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,this::goBack);
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost()) && uri.getPort()==-1
            && uri.getPath()!=null && uri.getPath().startsWith("/assets/site/");
    }
    private final class LocalClient extends WebViewClient {
        @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request) {
            Uri uri=request.getUrl();
            if (!isLocal(uri)) return blocked();
            String path=uri.getPath().substring("/assets/".length());
            if (path.contains("..") || path.contains("\\") || !path.matches("[a-zA-Z0-9_./-]+")) return blocked();
            try {
                String mime=path.endsWith(".html")?"text/html":path.endsWith(".js")?"application/javascript":
                    path.endsWith(".css")?"text/css":path.endsWith(".svg")?"image/svg+xml":path.endsWith(".json")?"application/json":"application/octet-stream";
                InputStream stream=getAssets().open(path);
                Map<String,String> headers=new HashMap<>();
                headers.put("X-Content-Type-Options","nosniff");
                headers.put("Cache-Control","no-cache");
                headers.put("Content-Security-Policy","default-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'");
                return new WebResourceResponse(mime,"UTF-8",200,"OK",headers,stream);
            } catch (Exception missing) {
                return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",new HashMap<>(),new ByteArrayInputStream(new byte[0]));
            }
        }
        @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request) {
            Uri uri=request.getUrl();
            if (isLocal(uri)) return false;
            if ("mapapp".equals(uri.getScheme()) && "copy".equals(uri.getHost()) && isLocal(Uri.parse(view.getUrl()))) {
                String value=uri.getQueryParameter("url");
                if (value!=null && value.length()<4096 && value.startsWith(ONLINE)) {
                    ((ClipboardManager)getSystemService(CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newPlainText("笔记本性能地图",value));
                    Toast.makeText(MainActivity.this,"已复制当前讲解的网页链接",Toast.LENGTH_SHORT).show();
                }
                return true;
            }
            openExternal(uri); return true;
        }
        @Override public void onPageFinished(WebView view,String url) {
            if (!isLocal(Uri.parse(url))) return;
            errorShown=false;
            String script="(function(){if(!window.CPU_GUIDE||!document.getElementById('cpu-name'))return false;"+
                "if(!window.__LAPTOP_ANDROID){window.__LAPTOP_ANDROID=true;document.addEventListener('click',function(e){"+
                "var b=e.target.closest&&e.target.closest('#share-model');if(!b)return;e.preventDefault();e.stopImmediatePropagation();"+
                "var u=new URL('"+ONLINE+"');u.search=location.search;u.hash='explore';location.href='mapapp://copy?url='+encodeURIComponent(u.href);"+
                "},true);}return true;})()";
            view.evaluateJavascript(script,result->{if(!"true".equals(result))showError();});
        }
        @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error) {
            if(request.isForMainFrame())showError();
        }
        @Override public boolean onRenderProcessGone(WebView view,RenderProcessGoneDetail detail) {
            ((LinearLayout)view.getParent()).removeView(view);view.destroy();web=null;showError();return true;
        }
    }
    private static WebResourceResponse blocked() {
        return new WebResourceResponse("text/plain","UTF-8",403,"Blocked",new HashMap<>(),new ByteArrayInputStream(new byte[0]));
    }
    private void openExternal(Uri uri) {
        if (!"https".equals(uri.getScheme()) && !"http".equals(uri.getScheme())) return;
        try { startActivity(new Intent(Intent.ACTION_VIEW,uri).addCategory(Intent.CATEGORY_BROWSABLE)); }
        catch (RuntimeException unavailable) { Toast.makeText(this,"没有找到可打开资料链接的浏览器",Toast.LENGTH_SHORT).show(); }
    }
    private void showError() {
        if(errorShown||isFinishing())return;errorShown=true;
        runOnUiThread(()->new AlertDialog.Builder(this).setTitle("页面未能打开")
            .setMessage("请更新手机的 Android System WebView 或 Chrome 后重试。也可以联网查看网页版。")
            .setPositiveButton("重试",(dialog,which)->{errorShown=false;if(web!=null)web.loadUrl(BASE+"index.html");else recreate();})
            .setNeutralButton("打开网页版",(dialog,which)->openExternal(Uri.parse(ONLINE)))
            .setNegativeButton("关闭",(dialog,which)->finish()).show());
    }
    private void goBack() { if(web!=null&&web.canGoBack())web.goBack();else finish(); }
    @Override public void onBackPressed() { goBack(); }
    @Override protected void onSaveInstanceState(Bundle state) { if(web!=null)web.saveState(state);super.onSaveInstanceState(state); }
    @Override protected void onPause() {
        if(web!=null){String url=web.getUrl();if(url!=null&&isLocal(Uri.parse(url)))getPreferences(MODE_PRIVATE).edit().putString("last",url).apply();web.onPause();}
        super.onPause();
    }
    @Override protected void onResume() { super.onResume();if(web!=null)web.onResume(); }
    @Override protected void onDestroy() { if(web!=null){web.stopLoading();web.destroy();web=null;}super.onDestroy(); }
}
